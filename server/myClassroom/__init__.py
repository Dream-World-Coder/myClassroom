from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from .configs import configs_dictionary

mongo = PyMongo()
cors = CORS()
jwt = JWTManager()

def create_app(configs_dictionary_key="dev"):
    app = Flask(__name__)
    app.config.from_object(configs_dictionary[configs_dictionary_key])

    mongo.init_app(app)
    cors.init_app(app, origins=["http://localhost:5173"], resources={r"/api/*": {"origins": "*"}})
    jwt.init_app(app)

    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api/v1")

    return app
