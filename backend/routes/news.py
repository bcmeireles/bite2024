import json
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS


from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                               unset_jwt_cookies, jwt_required

import requests
import base64
from PIL import Image
from bs4 import BeautifulSoup
from io import BytesIO
from typing import Tuple


def is_in_color_range(px: Tuple[int, int, int], minimal_color:int) -> bool:
    return px[0] >= minimal_color and px[1] >= minimal_color and px[2] >= minimal_color


def is_line_color_range(im: Image, y: int, minimal_color: int) -> bool:
    width, _ = im.size

    for x in range(0, width-1):
        px = im.getpixel((x, y))
        if not is_in_color_range(px, minimal_color):
            return False
    return True


def is_column_color_range(im: Image, x: int, minimal_color: int) -> bool:
    _, height = im.size

    for y in range(0, height-1):
        px = im.getpixel((x, y))
        if not is_in_color_range(px, minimal_color):
            return False
    return True




def remove_bars(im: Image, minimal_color: int) -> Tuple[Image, bool]:

    width, height = im.size
    top = 0
    bottom = height-1

    # if left border if same color -- skip, because we have no bars
    if is_column_color_range(im, 0, minimal_color):
        return im, False

    # calc white pixel rows from the top
    while is_line_color_range(im, top, minimal_color):
        top += 1

    # calc white pixel rows from the bottom
    while is_line_color_range(im, bottom, minimal_color):
        bottom -= 1

    # no white bars detected
    if top == 0 or bottom == height-1:
        return im, False

    # crop based on bars
    bbox = (0, top, width, bottom)
    return im.crop(bbox), True



url_base = 'https://www.ambienteportugal.pt'
url = url_base + '/events'


def create_routes(app):
    @app.get('/news/')
    def news():
        data = []

        r = requests.get(url)

        soup = BeautifulSoup(r.text, 'html.parser')

        articles = soup.find_all('div', class_='views-row')
        for article in articles:
            img = article.find('img', class_='img-responsive').get('src').rsplit('?', 1)[0]
            link = url_base + article.find('a').get('href', '/events')
            title = article.find('div', class_='event-title').text
            try:
                date = article.find('span', class_='date-display-single').text
            except AttributeError:
                date = article.find('span', class_='date-display-start').text


            img = Image.open(BytesIO(requests.get(img).content))
            img = img.convert("RGBA")
         
            img = remove_bars(img, 250)[0]
            
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img = base64.b64encode(buffered.getvalue()).decode('utf-8')

            data_article = {
                'picture':"data:image/png;base64," + img,
                'title':title,
                'url':link,
                'date':date
            }

            data.append(data_article)

            if 'views-row-last' in article.attrs['class']:
                break


        return data
