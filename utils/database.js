const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient
require('dotenv').config();

const mongoConnect = callback => {
  mongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      console.log("CONNECTED!")
      callback(client)
    })
    .catch(err => {
      console.log('Error starting the server', err)
    })
}

module.exports = mongoConnect