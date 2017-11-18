
from pymongo import MongoClient
import pymongo

mongo_URL = "mongodb://mongodb-stitch-olympics-xhlhd:cis550@cis550-shard-00-00-a0sk1.mongodb.net:27017,cis550-shard-00-01-a0sk1.mongodb.net:27017,cis550-shard-00-02-a0sk1.mongodb.net:27017/test?ssl=true&replicaSet=Cis550-shard-0&authSource=admin"
client = MongoClient(mongo_URL)
# client.adb.authenticate("cis550", "Cis550A+", mechanism='MONGODB-CR')
db = client.data.olympics

post={"name":"test"}
db.insert(post)
