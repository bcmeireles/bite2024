import requests

def fetch_recycling_bins(latitude, longitude, radius):
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    node[amenity=recycling]
      (around:{radius},{latitude},{longitude});
    out;
    """
    response = requests.get(overpass_url, params={'data': query})
    data = response.json()
    recycling_bins = []
    for element in data['elements']:
        if 'tags' in element:
            recycling_bins.append({
                'latitude': element['lat'],
                'longitude': element['lon'],
                'type': element['tags'].get('recycling:material', 'unknown')
            })
    return recycling_bins


# Example usage
#latitude = 51.5074  # Latitude of a given location
#longitude = -0.1278  # Longitude of a given location
#radius = 1000  # Radius in meters
#recycling_bins = fetch_recycling_bins(latitude, longitude, radius)
#for bin in recycling_bins:
#    print(f"Latitude: {bin['latitude']}, Longitude: {bin['longitude']}, Type: {bin['type']}")