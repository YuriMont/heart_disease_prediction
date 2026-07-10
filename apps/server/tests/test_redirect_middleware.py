from fastapi.testclient import TestClient

from api.app.app import app

client = TestClient(app)

REDIRECT_TESTS = [
    ("/prever", "/predict"),
    ("/dashboard/fatores", "/dashboard/factors"),
    ("/pacientes", "/patients"),
    ("/avaliacoes", "/evaluations"),
    ("/pacientes/some-uuid", "/patients/some-uuid"),
    ("/avaliacoes/some-uuid", "/evaluations/some-uuid"),
    ("/avaliacoes/some-uuid/fatores", "/evaluations/some-uuid/factors"),
    ("/avaliacoes/some-uuid/importancia", "/evaluations/some-uuid/importance"),
    ("/modelos", "/models"),
    ("/modelos/some-uuid", "/models/some-uuid"),
    ("/modelos/some-uuid/metricas", "/models/some-uuid/metrics"),
    ("/relatorios", "/reports"),
    ("/relatorios/some-uuid", "/reports/some-uuid"),
    ("/relatorios/exportar", "/reports/export"),
]


class TestRedirectMiddleware:
    def test_exact_path_redirects(self):
        for old_path, new_path in REDIRECT_TESTS:
            response = client.get(old_path, follow_redirects=False)
            assert response.status_code == 308, f"{old_path} should return 308"
            assert response.headers["location"] == new_path, (
                f"{old_path} should redirect to {new_path}, got {response.headers['location']}"
            )

    def test_new_paths_dont_redirect(self):
        new_paths = [new for _, new in REDIRECT_TESTS]
        for path in new_paths:
            response = client.get(path, follow_redirects=False)
            assert response.status_code != 308, f"{path} should not redirect"

    def test_unmatched_path_passes_through(self):
        response = client.get("/", follow_redirects=False)
        assert response.status_code != 308
