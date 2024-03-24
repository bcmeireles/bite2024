import base64
import requests

def f(filename):
     with open(filename, "rb") as img_file:
         img = img_file.read()
     base64_string = base64.b64encode(img).decode('utf-8')
     r = requests.post('http://127.0.0.1:5000/scanner', json={'image':base64_string})
     return r.text

print(f('image.jpg'))
