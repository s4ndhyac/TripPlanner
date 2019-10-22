from route.user import user_blueprint
from route.common import common_blueprint
from flask import Flask
from flask.ext.cors import CORS

import config
from model.abc import db

server = Flask(__name__)
server.debug = config.DEBUG

server.config['SQLALCHEMY_DATABASE_URI'] = config.DB_URI
server.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(server)
db.app = server

CORS(
    server,
    resources={r"/*": {"origins": "*"}},
    headers=['Content-Type', 'X-Requested-With', 'Authorization']
)

server.register_blueprint(common_blueprint)

server.register_blueprint(user_blueprint)


if __name__ == '__main__':
    server.run(host=config.HOST, port=config.PORT)
