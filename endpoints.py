from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task,  User
from schemas import task_schema, tasks_schema
from services import AuthService
api = Blueprint('api', __name__)

@api.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    admin = data.get("admin", False)
    return AuthService.register_user(username, password, admin)

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    return AuthService.authenticate_user(username, password)

@api.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():

    user = get_jwt_identity()
    tasks = AuthService.get_tasks(user)
    return tasks_schema.dump(tasks)

@api.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    user_id = get_jwt_identity()
    user=User.query.get_or_404(int(user_id))
    if not ser.admin and task.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403
    return task_schema.dump(task)

@api.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    print("Received request:", request.json)  # <-- Esto imprimirá el JSON recibido en la terminal
    user_id = get_jwt_identity()
    task_data = task_schema.load(request.json)
    task_data["user_id"] = user_id
    task = Task(**task_data)
    db.session.add(task)
    db.session.commit()
    return task_schema.dump(task), 201

@api.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    if not user.admin and task.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    for key, value in data.items():
        setattr(task, key, value)

    db.session.commit()
    return task_schema.dump(task)

@api.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    if not user.admin and task.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 204



