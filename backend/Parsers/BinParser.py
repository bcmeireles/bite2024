import json
import pandas as pd

# Source: https://geodados-cml.hub.arcgis.com/maps/0ffb19343bdd4b8c83a18c29b1f8ef04
with open('CircuitosContentores.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Convert the 'features' list to a pandas DataFrame
df = pd.json_normalize(data['features'])

# Filter the DataFrame to keep only the features below
desired_types = [
    'Vidrão',
    'Ecoilha Subterrânea',
    'Ecoponto de superfície',
    'EcoIlha',
    'Ecoilha Bilateral',
    'Suporte Fixação Contentores',
    'Suporte Fixação Contentores Select',
    'Ecoilha Ecoponto',
    'Remoção colectiva',
    'Vidrão subterrâneo',
    'Ecoponto subterrâneo'
]
filtered_df = df[df['properties.PONTO_RECOLHA_TIPO'].isin(desired_types)]

filtered_df = filtered_df.drop_duplicates(subset='properties.PONTO_RECOLHA')

# DataFrame with the required fields
new_df = pd.DataFrame(columns=['id', 'coordinates', 'Type'])

for _, row in filtered_df.iterrows():
    pon_recolha = row['properties.PONTO_RECOLHA']
    coordinates = row['geometry.coordinates']

    recolha_type = []
    if row['properties.PONTO_RECOLHA_TIPO'] in ['Vidrão', 'Vidrão subterrâneo']:
        recolha_type.append('Glass')
    elif row['properties.PONTO_RECOLHA_TIPO'] == 'Remoção colectiva':
        recolha_type.append('Trash')
    else:
        recolha_type.append('Full')

    new_row = pd.DataFrame([{'id': pon_recolha, 'coordinates': coordinates, 'Type': recolha_type}])
    new_df = pd.concat([new_df, new_row], ignore_index=True)

# DataFrame to a list of dictionaries
new_data = new_df.to_dict('records')


with open('Filtered.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)



# --------------------------------------------
    
with open('FilteredOleos.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)



for feature in data['features']:
    code = feature['properties']['COD_SIG']
    try:
        index = new_df.index[new_df['id'] == code].tolist()[0]
        value = new_df.loc[index]['Type'].append('Oil')
    except IndexError:
        new_df = pd.concat([new_df, pd.DataFrame([{'id':code, 'coordinates': feature['geometry']['coordinates'], 'Type': ['Oil']}])], ignore_index=True)


# DataFrame to a list of dictionaries
new_data = new_df.to_dict('records')


with open('Filtered2.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)


# --------------------------------------------

#https://geodados-cml.hub.arcgis.com/datasets/CML::amb-reciclagem-1?layer=9
with open('Pilhoes.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)



for feature in data['features']:
    code = feature['properties']['COD_SIG']
    try:
        index = new_df.index[new_df['id'] == code].tolist()[0]
        value = new_df.loc[index]['Type'].append('Battery')
    except IndexError:
        new_df = pd.concat([new_df, pd.DataFrame([{'id':code, 'coordinates': feature['geometry']['coordinates'], 'Type': ['Battery']}])], ignore_index=True)


# DataFrame to a list of dictionaries
new_data = new_df.to_dict('records')


with open('Filtered3.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)


k = []
for line in new_data:

    for _type in line['Type']  :
        k.append({
            'lat': line['coordinates'][1],
            'long': line['coordinates'][0],
            'type': _type
        })


with open('CoordinateList.json', 'w', encoding='utf-8') as f:
    json.dump(k, f, ensure_ascii=False, indent=4)
