from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_default_database()


def get_all_produdcts():
    products_list = db["favorites"]
    return list(products_list.find())


def get_favorites():
    favorites_list = db["favorites"]
    return list(favorites_list.find())
