from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, JWTManager

from models import db, User, Task
class AuthService:
    @staticmethod
    def register_user(username, password, admin=False):
        if User.query.filter_by(username=username).first():
            return {"error": "User already exists"}, 400
        new_user = User(username=username, admin=admin)
        new_user.set_password(password)  # Hash password
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User registered successfully"}, 201

    @staticmethod
    def authenticate_user(username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            # Convertir user_id en un string (JWT requiere un string en 'sub')
            access_token = create_access_token(identity=str(user.id), additional_claims={"admin": user.admin})
            return {"message": "Login successful", "access_token": access_token}, 200
        return {"error": "Invalid credentials"}, 401

    @staticmethod
    def get_tasks(user_id):
        user=User.query.get_or_404(int(user_id))
        if user.admin:
            return Task.query.all()
        return Task.query.filter_by(user_id=user.id).all()