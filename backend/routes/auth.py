from db import Collection
import json
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required


db = Collection('users')

def create_routes(app):
    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                data = response.get_json()
                if type(data) is dict:
                    data["access_token"] = access_token 
                    response.data = json.dumps(data)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Check if all fields are present
        if not name or not email or not password:
            return jsonify({'error': 'Missing fields'}), 400

        # Check if user already exists
        existing_user = db.get_by_key('email', email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create a new user and save it to the database
        new_user = {
            'name': name,
            'email': email,
            'hashed_password': hashed_password,
            'points': 0,
            'history': [],
            'image': '',
            'quizzes': [False, False, False],
            'news': [],
            'settings': {},
        }
        
        db.create(new_user)

        access_token = create_access_token(identity=email)

        return jsonify({"status": "success", 'message': 'User registered successfully', "token": access_token}), 201

    @app.route('/login', methods=['POST'])
    def login():
        email = request.json.get('email')
        password = request.json.get('password')

        user = db.get_by_key('email', email)

        if not user or not check_password_hash(user['hashed_password'], password):
            return jsonify({'success': False, 'status': "failed", 'message': 'Invalid email or password'})

        access_token = create_access_token(identity=email)

        user_safe = user.copy()
        user_safe.pop('_id')
        user_safe.pop('hashed_password')

        return jsonify({"success": True, "status": "success", 'token': access_token, 'user': user_safe}), 200


    @app.route("/logout", methods=["POST"])
    def logout():
        response = jsonify({"msg": "logout successful"})
        unset_jwt_cookies(response)
        return response

    @app.route("/profile", methods=["GET"])
    @jwt_required()
    def my_profile():

        # get the user's email from the token
        email = get_jwt_identity()
        
        # get the user from the database
        user = db.get_by_key('email', email)

        user_safe = user.copy()
        user_safe.pop('_id')
        user_safe.pop('hashed_password')

        return jsonify({"status": "success", "data": user_safe})
