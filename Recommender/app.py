from flask import Flask
from flask_cors import CORS
from config import Config
from routes.recommendation_routes import recommendation_bp

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": [Config.HOST_URL]}})

app.register_blueprint(recommendation_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
