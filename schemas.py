# schemas.py
from marshmallow import Schema, fields

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=False)
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    status = fields.Str(required=True)
task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)