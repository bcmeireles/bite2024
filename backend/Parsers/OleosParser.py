import json
import pandas as pd

# Source: https://geodados-cml.hub.arcgis.com/datasets/CML::amb-reciclagem-1?layer=4
with open('Oleos.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Convert the 'features' list to a pandas DataFrame
df = pd.json_normalize(data['features'])

desired_types = [
    'Ecoilha-Sub',
    'Oleao',
    'V',
    'EcoIlha-Bi',
    'SFCS',
    'EcoIlha',
    'SUB',
    'ECO',
    'V SUB'
]

filtered_df = df[df['properties.TPRS_AB'].isin(desired_types)]

# Filter the DataFrame to keep only the features below
filtered_features = []
for _, row in filtered_df.iterrows():
    feature = {
        "type": "Feature",
        "properties": {
            k.split('.')[1]: v
            for k, v in row.items()
            if k.startswith('properties.')
        },
        "geometry": {
            k.split('.')[1]: v
            for k, v in row.items()
            if k.startswith('geometry.')
        },
    }
    filtered_features.append(feature)

# dictionary with the filtered features
filtered_data = {
    "type": data["type"],
    "name": data["name"],
    "crs": data["crs"],
    "features": filtered_features
}

# formated string for debugging purposes
filtered_features_formatted = ",\n".join(json.dumps(feature, ensure_ascii=False) for feature in filtered_data['features'])

with open('FilteredOleos.geojson', 'w', encoding='utf-8') as f:
    f.write("{\n")
    f.write('"type": "FeatureCollection",\n')
    f.write('"name": "Amb_Reciclagem",\n')
    f.write('"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },\n')
    f.write('"features": [\n')
    f.write(filtered_features_formatted)
    f.write("\n]\n}")
