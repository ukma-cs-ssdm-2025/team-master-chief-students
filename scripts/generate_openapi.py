import requests
import subprocess
from pathlib import Path
import shlex

OPENAPI_URL = "http://localhost:8080/v3/api-docs.yaml"
ROOT_DIR = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT_DIR / "docs" / "api"
OPENAPI_FILE = DOCS_DIR / "openapi.yaml"
REDOC_FILE = DOCS_DIR / "index.html"

print("🚀 Генерація OpenAPI YAML...")
DOCS_DIR.mkdir(parents=True, exist_ok=True)

try:
    response = requests.get(OPENAPI_URL)
    response.raise_for_status()
    OPENAPI_FILE.write_text(response.text, encoding="utf-8")
    print(f"✅ YAML збережено: {OPENAPI_FILE}")
except Exception as e:
    print(f"❌ Помилка при отриманні YAML: {e}")
    exit(1)

print("🧱 Генерація Redoc HTML...")
try:
    # Використовуємо нову CLI і обов'язково лапки для шляхів
    cmd = f'npx @redocly/cli build-docs "{OPENAPI_FILE}" --output "{REDOC_FILE}"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"✅ Redoc HTML збережено: {REDOC_FILE}")
except subprocess.CalledProcessError as e:
    print(f"❌ Помилка при генерації Redoc HTML: {e}")
