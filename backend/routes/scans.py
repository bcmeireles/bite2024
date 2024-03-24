from db import Collection
import numpy as np
import json
import base64
from PIL import Image
import io
import keras.utils as ku
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required


from keras.models import load_model

users = Collection('users')

model = load_model('model.h5')

number_to_class = ['cardboard',\
                   'glass',\
                   'metal',
                   'paper',\
                   'plastic',\
                   'trash',]

def create_routes(app):
    @app.route('/scanner/', methods=['POST'])
    @jwt_required()
    def scan():
        email = get_jwt_identity()

        user = users.get_by_key('email', email)

        user['points'] += 1
        user['history'].append({
            'date': datetime.now().isoformat(),
            'change': 1,
            'reason': 'Scanned an item'
        })
        users.update(user['_id'], user)

        base64_string = request.json.get('image')

        #base64_string = "data:image/webp;base64," + base64_string
        print(base64_string)
        # decode base64 string
        img_data = base64.b64decode(base64_string)

        # convert decoded data to image
        img = Image.open(io.BytesIO(img_data))

        # resize and normalize the image
        img = img.resize((32,32), resample=0)
        img = ku.img_to_array(img, dtype=np.uint8)
        img = np.array(img)/255.0
        prediction = model.predict(img[np.newaxis, ...])
        predicted_class = number_to_class[np.argmax(prediction[0], axis=-1)]

        return jsonify({'prediction': predicted_class})


        
