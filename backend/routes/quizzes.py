from db import Collection
import json
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS


from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required


db = Collection('quizzes')
db_users = Collection('users')

def create_routes(app):
    @app.get('/quizzes/<int:unit>')
    def quizzes_get(unit):
        quizzes = db.get_by_key('unit', unit, True)
        for quiz in quizzes:
            quiz['_id'] = str(quiz['_id'])

        return quizzes


    
    @app.post('/quizzes/<int:unit>')
    @jwt_required()
    def quizzes_post(unit):
        email = get_jwt_identity()
        user = db_users.get_by_key('email', email)
        user['quizzes'][unit] = True

        db_users.update(user['_id'], user)

        return {'status':'success'}
