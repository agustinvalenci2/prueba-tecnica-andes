from flask import Flask, render_template,send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from models import db
from endpoints import api

app = Flask(__name__,static_folder="static", template_folder="templates")

# Configuración de la base de datos
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tasks.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"

db.init_app(app)
jwt = JWTManager(app)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

app.register_blueprint(api, url_prefix="/api")
@app.route("/")
def home():
    return render_template("index.html")
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

