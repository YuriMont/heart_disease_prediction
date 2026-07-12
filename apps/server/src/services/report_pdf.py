from io import BytesIO
from zoneinfo import ZoneInfo

from fpdf import FPDF

from database.models.evaluation import Evaluation
from schemas.result import ContributingFactor, FeatureImportance
from services.constants import (
    _config,
    get_categories,
    get_display_name,
    get_short_name_pt,
    get_unit,
)
from services.recommendations import generate_recommendations

# --- Palette (RGB) ---
PRIMARY = (190, 30, 45)
SUCCESS = (5, 150, 105)
WARNING = (217, 119, 6)
DANGER = (220, 38, 38)
SURFACE = (248, 250, 252)
WHITE = (255, 255, 255)
TEXT_PRIMARY = (30, 41, 59)
TEXT_SECONDARY = (100, 116, 139)
TEXT_MUTED = (148, 163, 184)
BORDER = (226, 232, 240)
HEADER_BG = (190, 30, 45)

# --- Spacing (mm) ---
SPACE_XS = 2
SPACE_SM = 4
SPACE_MD = 6
SPACE_LG = 10

# --- Typography ---
TITLE_FONT = ("Helvetica", "B", 18)
HEADING_FONT = ("Helvetica", "B", 12)
BODY_FONT = ("Helvetica", "", 9)
SMALL_FONT = ("Helvetica", "", 7)
MEGA_FONT = ("Helvetica", "B", 26)
BADGE_FONT = ("Helvetica", "B", 11)

BAR_MAX_W = 80

_DISPLAY_TO_KEY = {v.display_name: k for k, v in _config.features.items()}

_RESULT_TRANSLATIONS = {
    "Possible heart disease": "Poss\u00edvel doen\u00e7a card\u00edaca",
    "No indication of disease": "Nenhum ind\u00edcio de doen\u00e7a",
}

_DISCLAIMER_TEXT = (
    "Este relat\u00f3rio foi gerado por intelig\u00eancia artificial para suporte \u00e0 decis\u00e3o cl\u00ednica. "
    "Os resultados s\u00e3o baseados em modelos estat\u00edsticos e n\u00e3o substituem a avalia\u00e7\u00e3o "
    "de um profissional de sa\u00fade qualificado. Recomenda-se que todas as decis\u00f5es m\u00e9dicas "
    "sejam tomadas por um cardiologista respons\u00e1vel."
)

CONTENT_W: float  # set at runtime


def _risk_color(probability: float) -> tuple[int, int, int]:
    if probability >= 0.65:
        return DANGER
    if probability >= 0.35:
        return WARNING
    return SUCCESS


def _risk_label(probability: float) -> str:
    if probability >= 0.65:
        return "ALTO RISCO"
    if probability >= 0.35:
        return "M\u00c9DIO RISCO"
    return "BAIXO RISCO"


def _format_value(evaluation: Evaluation, key: str) -> str:
    feat = _config.features[key]
    raw = getattr(evaluation, key)
    if feat.type == "continuous":
        unit = get_unit(key) or ""
        if unit:
            return f"{raw:.1f} {unit}".replace(".0 ", " ")
        return f"{raw:.1f}".rstrip("0").rstrip(".")
    mapping = get_categories(key) or {}
    return mapping.get(raw, str(raw))


class ReportPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=True, margin=15)
        self.set_margins(20, 15, 20)
        global CONTENT_W
        CONTENT_W = self.w - self.l_margin - self.r_margin

    def footer(self) -> None:
        if self.page_no() == 0:
            return
        self.set_y(-15)
        self.set_draw_color(*BORDER)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(3)
        self.set_font(*SMALL_FONT)
        self.set_text_color(*TEXT_MUTED)
        self.cell(
            0, 4, f"CardioPredict  -  P\u00e1gina {self.page_no()}", align="C"
        )

    # ------------------------------------------------------------------
    #  Helpers
    # ------------------------------------------------------------------

    def ensure_space(self, height: float) -> None:
        if self.get_y() + height > self.h - self.b_margin:
            self.add_page()

    def content_width(self) -> float:
        return self.w - self.l_margin - self.r_margin

    def draw_horizontal_rule(self) -> None:
        self.set_draw_color(*BORDER)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(SPACE_SM)

    def draw_section_title(self, title: str) -> None:
        self.ensure_space(12)
        self.set_font(*HEADING_FONT)
        self.set_text_color(*TEXT_PRIMARY)
        self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(SPACE_XS)

    def draw_card(
        self,
        height: float,
        fill_color: tuple[int, int, int] | None = None,
        border_color: tuple[int, int, int] | None = None,
    ) -> tuple[float, float]:
        self.ensure_space(height)
        x = self.get_x()
        y = self.get_y()
        w = self.content_width()
        fc = fill_color or SURFACE
        bc = border_color or BORDER
        self.set_fill_color(*fc)
        self.set_draw_color(*bc)
        self.rect(x, y, w, height, style="DF")
        return x, y

    def draw_progress_bar(
        self,
        bar_width: float,
        height: float,
        color: tuple[int, int, int],
        max_bar_w: float = BAR_MAX_W,
    ) -> None:
        if bar_width <= 0:
            return
        self.set_fill_color(*color)
        self.cell(min(bar_width, max_bar_w), height, "", fill=True)

    # ------------------------------------------------------------------
    #  Header
    # ------------------------------------------------------------------

    def draw_header(self, evaluation: Evaluation) -> None:
        self.set_fill_color(*HEADER_BG)
        self.rect(self.l_margin, self.get_y(), self.content_width(), 24, style="F")
        self.set_font(*TITLE_FONT)
        self.set_text_color(*WHITE)
        self.set_xy(self.l_margin + 6, self.get_y() + 3)
        self.cell(0, 8, "CardioPredict", new_x="LMARGIN", new_y="NEXT")
        self.set_xy(self.l_margin + 6, self.get_y())
        self.set_font(*SMALL_FONT)
        self.set_text_color(255, 255, 255)
        self.cell(0, 5, "Relat\u00f3rio de Avalia\u00e7\u00e3o Cardiovascular")
        self.set_y(self.get_y() + 24 + SPACE_SM)

        self.set_font(*BODY_FONT)
        self.set_text_color(*TEXT_SECONDARY)
        utc_dt = evaluation.created_at.replace(tzinfo=ZoneInfo("UTC"))
        brt_dt = utc_dt.astimezone(ZoneInfo("America/Sao_Paulo"))
        info_lines = [
            f"Paciente: {evaluation.patient_name or 'N/A'}",
            f"Modelo: {evaluation.model_used}",
            f"Data: {brt_dt.strftime('%d/%m/%Y %H:%M')}",
            f"ID: {evaluation.id}",
        ]
        for line in info_lines:
            self.cell(0, 5, line, new_x="LMARGIN", new_y="NEXT")
        self.ln(SPACE_SM)
        self.draw_horizontal_rule()

    # ------------------------------------------------------------------
    #  Result
    # ------------------------------------------------------------------

    def draw_result_section(self, evaluation: Evaluation) -> None:
        prob = evaluation.disease_probability
        color = _risk_color(prob)
        label = _risk_label(prob)
        card_h = 60

        x0, y0 = self.draw_card(card_h)
        cx = x0 + SPACE_MD
        cy = y0 + SPACE_MD

        # Badge
        self.set_xy(cx, cy)
        self.set_font(*BADGE_FONT)
        self.set_text_color(*WHITE)
        self.set_fill_color(*color)
        bw = self.get_string_width(label) + 8
        self.cell(bw, 7, label, fill=True, align="C")

        # Probability
        self.set_xy(cx, cy + 10)
        self.set_font(*MEGA_FONT)
        self.set_text_color(*TEXT_PRIMARY)
        self.cell(0, 10, f"{prob * 100:.1f}%")

        # Progress bar
        bar_y = cy + 24
        bar_full = self.content_width() - SPACE_MD * 2
        self.set_xy(cx, bar_y)
        self.set_fill_color(*BORDER)
        self.cell(bar_full, 6, "", fill=True)
        self.set_xy(cx, bar_y)
        self.set_fill_color(*color)
        self.cell(bar_full * prob, 6, "", fill=True)

        # Conclusion
        self.set_xy(cx, bar_y + 10)
        self.set_font(*BODY_FONT)
        self.set_text_color(*TEXT_SECONDARY)
        text = _RESULT_TRANSLATIONS.get(evaluation.result_text, evaluation.result_text)
        self.multi_cell(self.content_width() - SPACE_MD * 2, 5, text)

        self.set_y(y0 + card_h + SPACE_SM)

    # ------------------------------------------------------------------
    #  Clinical Data
    # ------------------------------------------------------------------

    def draw_clinical_table(self, evaluation: Evaluation) -> None:
        self.draw_section_title("Dados Cl\u00ednicos")

        rows = []
        for key in _config.features:
            label = get_short_name_pt(key) or key
            value = _format_value(evaluation, key)
            rows.append((label, value))

        col_w = self.content_width() / 2 - 4
        self.set_font(*BODY_FONT)
        for i in range(0, len(rows), 2):
            pair = rows[i : i + 2]
            self.ensure_space(6)
            for label, value in pair:
                self.set_text_color(*TEXT_SECONDARY)
                self.cell(col_w - 30, 6, label)
                self.set_text_color(*TEXT_PRIMARY)
                self.cell(30, 6, value)
            self.ln(6)
        self.ln(SPACE_SM)

    # ------------------------------------------------------------------
    #  Contributing Factors
    # ------------------------------------------------------------------

    def draw_contributing_factors(self, factors: list[ContributingFactor]) -> None:
        if not factors:
            return

        self.draw_section_title("Fatores Contribuintes")

        sorted_factors = sorted(
            [f for f in factors if abs(f.impact) > 0],
            key=lambda f: abs(f.impact),
            reverse=True,
        )
        if not sorted_factors:
            return

        max_abs = sorted_factors[0].impact
        bar_full = 60

        for f in sorted_factors:
            self.ensure_space(7)
            key = _DISPLAY_TO_KEY.get(f.variable, f.variable)
            short_name = get_short_name_pt(key) or get_display_name(key) or f.variable
            is_pos = f.impact >= 0
            bar_color = DANGER if is_pos else SUCCESS
            bar_w = (abs(f.impact) / max_abs) * bar_full

            self.set_font("Helvetica", "B", 11)
            self.set_text_color(*bar_color)
            sym = "+" if is_pos else "-"
            self.cell(6, 6, sym)

            self.set_font(*BODY_FONT)
            self.set_text_color(*TEXT_PRIMARY)
            self.cell(48, 6, short_name)

            self.set_text_color(*TEXT_SECONDARY)
            self.cell(24, 6, f.value)

            self.draw_progress_bar(bar_w, 6, bar_color, bar_full)

            self.set_font(*BODY_FONT)
            self.set_text_color(*bar_color)
            impact_str = f"+{f.impact:.2f}" if is_pos else f"{f.impact:.2f}"
            self.cell(0, 6, impact_str, new_x="LMARGIN", new_y="NEXT")
        self.ln(SPACE_SM)

    # ------------------------------------------------------------------
    #  Feature Importance
    # ------------------------------------------------------------------

    def draw_feature_importance(self, importance: list[FeatureImportance]) -> None:
        if not importance:
            return

        filtered = [i for i in importance if i.weight > 0]
        if not filtered:
            return

        self.draw_section_title("Import\u00e2ncia das Vari\u00e1veis")

        sorted_imp = sorted(filtered, key=lambda i: i.weight, reverse=True)
        max_weight = sorted_imp[0].weight

        for imp in sorted_imp:
            self.ensure_space(7)
            key = _DISPLAY_TO_KEY.get(imp.variable, imp.variable)
            short_name = get_short_name_pt(key) or get_display_name(key) or imp.variable
            bar_w = (imp.weight / max_weight) * BAR_MAX_W

            self.set_font(*BODY_FONT)
            self.set_text_color(*TEXT_PRIMARY)
            self.cell(50, 7, short_name)

            self.set_fill_color(*BORDER)
            self.cell(BAR_MAX_W, 7, "", fill=True)
            x_bar = self.get_x() - BAR_MAX_W
            y_bar = self.get_y()
            self.set_fill_color(*PRIMARY)
            self.set_xy(x_bar, y_bar)
            self.cell(max(bar_w, 1), 7, "", fill=True)
            self.set_xy(x_bar + BAR_MAX_W, y_bar)

            self.set_font(*SMALL_FONT)
            self.set_text_color(*TEXT_SECONDARY)
            self.cell(0, 7, f"  {imp.weight:.4f}", new_x="LMARGIN", new_y="NEXT")
        self.ln(SPACE_SM)

    # ------------------------------------------------------------------
    #  Recommendations
    # ------------------------------------------------------------------

    def draw_recommendations(
        self, evaluation: Evaluation, factors: list[ContributingFactor]
    ) -> None:
        recs = generate_recommendations(evaluation, factors)
        if not recs:
            return

        self.draw_section_title("Recomenda\u00e7\u00f5es")

        card_h = 10
        for i, rec in enumerate(recs, 1):
            text_w = self.content_width() - SPACE_MD * 2 - 6
            est = max(card_h, (len(rec) // int(text_w / 4) + 1) * 5 + 6)
            self.ensure_space(est)

            x0 = self.get_x()
            y0 = self.get_y()
            self.set_fill_color(252, 252, 253)
            self.set_draw_color(*BORDER)
            self.rect(x0, y0, self.content_width(), est, style="DF")

            self.set_xy(x0 + SPACE_MD, y0 + 3)
            self.set_font("Helvetica", "B", 9)
            self.set_text_color(*PRIMARY)
            self.cell(6, 5, f"{i}.")
            self.set_xy(x0 + SPACE_MD + 6, y0 + 3)
            self.set_font(*BODY_FONT)
            self.set_text_color(*TEXT_PRIMARY)
            self.multi_cell(text_w, 5, rec)

            actual_h = self.get_y() - y0 + 2
            self.set_y(y0 + max(est, actual_h))

    # ------------------------------------------------------------------
    #  Disclaimer
    # ------------------------------------------------------------------

    def draw_disclaimer(self) -> None:
        self.draw_horizontal_rule()
        self.ensure_space(24)

        x0 = self.get_x()
        y0 = self.get_y()
        box_h = 20
        self.set_fill_color(249, 250, 251)
        self.set_draw_color(*BORDER)
        self.rect(x0, y0, self.content_width(), box_h, style="DF")

        self.set_xy(x0 + SPACE_MD, y0 + SPACE_XS)
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(*TEXT_PRIMARY)
        self.cell(0, 4, "Importante", new_x="LMARGIN", new_y="NEXT")

        self.set_xy(x0 + SPACE_MD, y0 + SPACE_XS + 5)
        self.set_font(*SMALL_FONT)
        self.set_text_color(*TEXT_MUTED)
        self.multi_cell(self.content_width() - SPACE_MD * 2, 3.5, _DISCLAIMER_TEXT)

        actual = self.get_y() - y0 + SPACE_XS
        self.set_y(y0 + max(box_h, actual))


def generate_pdf_report(
    evaluation: Evaluation,
    factors: list[ContributingFactor],
    importance: list[FeatureImportance],
) -> BytesIO:
    pdf = ReportPDF()
    pdf.add_page()

    pdf.draw_header(evaluation)
    pdf.draw_result_section(evaluation)
    pdf.draw_clinical_table(evaluation)
    pdf.draw_contributing_factors(factors)
    pdf.draw_feature_importance(importance)
    pdf.draw_recommendations(evaluation, factors)
    pdf.draw_disclaimer()

    buf = BytesIO()
    pdf.output(buf)
    buf.seek(0)
    return buf
