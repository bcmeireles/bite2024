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

import math



def create_routes(app):
    @app.get('/markers/')
    def markers():

        givenLat = request.args.get('lat', type=float)
        givenLong = request.args.get('long', type=float)
        radius = request.args.get('radius', type=int)

        with open('routes/CoordinateList.json') as f:
            data = json.load(f)

        # Convert the pinpoint location's latitude and longitude to radians
        radLong = math.radians(givenLong)
        radLat = math.radians(givenLat)

        inRadius = []

        for item in data:
            lat = item['lat']
            long = item['long']
            type = item['type']

            # Convert the coordinate's latitude and longitude to radians
            currRadLat = math.radians(lat)
            currRadLong = math.radians(long)

            diffLat = currRadLat - radLat
            diffLong = currRadLong - radLong

            # Distance using the Haversine formula
            a = math.sin(diffLat / 2) ** 2 + math.cos(radLat) * math.cos(currRadLat) * math.sin(diffLong / 2) ** 2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            distance = 6371 * c # Earth radius in kilometers

            # Distance 
            #print(f"Distance to coordinate ({lat}, {long}): {distance} km")

            if distance <= radius/1000: # Convert radius to kilometers
                coordinate = {"lat": lat, "long": long, "type": type}
                inRadius.append(coordinate)

        result_json = json.dumps(inRadius)

        return result_json