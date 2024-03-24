import sys
import json
import math

def getData(givenLat,givenLong,radius):
    with open('CoordinateList.json') as f:
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

if __name__ == "__main__":
    getData(float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]))