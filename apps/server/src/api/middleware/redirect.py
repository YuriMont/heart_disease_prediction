import re

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse

REDIRECT_MAP = {
    "/prever": "/predict",
    "/dashboard/fatores": "/dashboard/factors",
    "/pacientes": "/patients",
    "/avaliacoes": "/evaluations",
    "/modelos": "/models",
    "/relatorios": "/reports",
    "/relatorios/exportar": "/reports/export",
}

_PATH_PARAM_MAP = [
    (re.compile(r"^/pacientes/([^/]+)$"), r"/patients/\1"),
    (re.compile(r"^/avaliacoes/([^/]+)$"), r"/evaluations/\1"),
    (re.compile(r"^/avaliacoes/([^/]+)/fatores$"), r"/evaluations/\1/factors"),
    (re.compile(r"^/avaliacoes/([^/]+)/importancia$"), r"/evaluations/\1/importance"),
    (re.compile(r"^/modelos/([^/]+)$"), r"/models/\1"),
    (re.compile(r"^/modelos/([^/]+)/metricas$"), r"/models/\1/metrics"),
    (re.compile(r"^/relatorios/([^/]+)$"), r"/reports/\1"),
]


class RedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Check exact matches first
        if path in REDIRECT_MAP:
            return RedirectResponse(url=REDIRECT_MAP[path], status_code=308)

        # Check path parameter matches
        for pattern, replacement in _PATH_PARAM_MAP:
            if pattern.match(path):
                new_path = pattern.sub(replacement, path)
                return RedirectResponse(url=new_path, status_code=308)

        return await call_next(request)
