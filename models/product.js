const mongodb = require('mongodb');
const getDB = require('../utils/database').getDB;
class Product {

  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectId(id) : null
    this.userId = userId
  }


  save() {
    const db = getDB();
    let dbOp;
    let log;
    if(this._id) {
      dbOp = db.collection('products').updateOne({
        _id: this._id
      }, { $set: this })
    } else {
      dbOp = db.collection('products')
     .insertOne(this)
    }

    return dbOp.then((result) => {
      console.log('result of saving product model', result)
    }).catch((err) => {
      console.log('error saving product', err)
    });
  }

  updateProduct() {
    const db = getDB();
    return db.collection('products').updateOne(this)
    .then((result) => {
      console.log('result of updating product model', result)
    }).catch((err) => {
      console.log('error updating product', err)
    });
  }
  
  static fetchAll() {
    const db = getDB();
    return db.collection('products')
    .find()
    .toArray()
    .then((products) => {
      console.log('Products from fetchAll', products)
      return products
    })
    .catch(err => {
      console.log('Error fetching all products', err)
    });
  }

  static findById(productId) {
    const db = getDB();
    return db.collection('products').find({
      _id: new mongodb.ObjectId(productId)
    })
    .next()
    .then(product => {
      console.log('Products from findById', product, productId)
      return product
    })
    .catch(err => {
      console.log('Error fetching product', err)
    });
  }

  static deleteById(productId) {
    const db = getDB();
    return db.collection('products').deleteOne({
      _id: new mongodb.ObjectId(productId)
    })
    .then((result) => {
      console.log('ITEM DELETED SUCCESSFULLY')
    }).catch((err) => {
      console.log('Error Deleting Item', err)
    });
  }

}

module.exports = Product