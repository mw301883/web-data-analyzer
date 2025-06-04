from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from backend.routes.auth import auth_bp
from backend.db import init_db, ensure_admin_user

load_dotenv(dotenv_path="../.env")

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "fallback-secret")
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/api')

init_db()
ensure_admin_user()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
