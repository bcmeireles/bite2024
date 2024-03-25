from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient('localhost', 27017)
db = client['bite2024']

class Collection:
    def __init__(self, collection_name):
        self.collection = db[collection_name]

    def get_all(self):
        return list(self.collection.find())

    def get_by_id(self, id):
        return self.collection.find_one({'_id': ObjectId(id)})

    def get_by_key(self, key, value, multiple=False):
        if multiple:
            return list(self.collection.find({key: value}))
        return self.collection.find_one({key: value})

    def create(self, data):
        return self.collection.insert_one(data).inserted_id

    def update(self, id, data):
        return self.collection.update_one({'_id': ObjectId(id)}, {'$set': data})

    def delete(self, id):
        return self.collection.delete_one({'_id': ObjectId(id)})
