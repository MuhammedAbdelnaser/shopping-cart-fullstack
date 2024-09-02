const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient
require('dotenv').config();

let _db;

const mongoConnect = callback => {
  mongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      console.log("CONNECTED!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log('Error starting the server', err)
      throw err
    })
}

const getDB = () => {
  if(_db) {
    return _db;
  }
  throw 'No Database Found'

}

exports.mongoConnect = mongoConnect
exports.getDB = getDB