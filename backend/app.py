from flask import Flask
from flask_cors import CORS


from routes import auth, quizzes, scans, learn, markers, news

from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "do-not-want-to-change"
jwt = JWTManager(app)

def create_routes():
    auth.create_routes(app)
    quizzes.create_routes(app)
    scans.create_routes(app)
    learn.create_routes(app)
    markers.create_routes(app)
    news.create_routes(app)

if __name__ == '__main__':
    create_routes()
    app.run(host="0.0.0.0", port=5000, debug=True)
