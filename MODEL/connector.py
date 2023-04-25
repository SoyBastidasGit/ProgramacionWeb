from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://SoyBastidas:SoyBastidas123@erp.a1ztdjx.mongodb.net/<LoginDB>?retryWrites=true&w=majority"

# Crea un nuevo cliente y conexion al servidor de la bd y coleccion
client = MongoClient(uri)
mongo_db = client["LoginDB"]
mongo_collection = mongo_db["Users"]

def login_auth(user, password):
    document = mongo_collection.find_one({user: user, password: password})
    if document:
        return True
    else:
        return False
