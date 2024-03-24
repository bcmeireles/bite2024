from db import Collection
import json
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS


from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required


db = Collection('learn')

def create_routes(app):
    @app.get('/study/<int:unit>')
    def infos_get(unit):
        infos = db.get_by_key('unit', unit, True)
        for quiz in infos:
            quiz['_id'] = str(quiz['_id'])

        return infos