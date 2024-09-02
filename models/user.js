const getDB = require('../utils/database').getDB;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId
class User {
  constructor(username, email, cart, id) {
      this.name = username;
      this.email = email;
      this.cart = cart;
      this._id = id
  }

  save() {
    const db = getDB();
    return db.collection('users').insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      })
    }
    const updatedCart = {
      items: updatedCartItems
    }
    const db = getDB();
    return db
    .collection('users')
    .updateOne(
      {_id: new ObjectId(this._id)},
      {$set: {cart: updatedCart}}
    )
  }

  static findById(userId) {
    const db = getDB();
    return db
    .collection('users')
    .findOne({_id: new ObjectId(userId)}).then((user) => {
      console.log('user', user)
      return user
    }).catch((err) => {
      console.log('Error Getting User', err)
    });
  }

  getCart() {
    const productIds = this.cart.items.map(p => p.productId)
    const db = getDB();
    return db.collection('products')
    .find({ _id: {$in: productIds }})
    .toArray()
    .then(products => {
      return products.map(p => {
        return {...p, quantity: this.cart.items.find(pr => { 
         return  pr.productId.toString() === p._id.toString()
        }).quantity
        }
      })
    }).catch((err) => {
      
    });
  }

  deleteCartItem(productId) {
    const db = getDB();
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString()
    })
    return db.collection('users').updateOne(
      { _id: this._id},
      {$set: { cart: {items: updatedCartItems} }}
    )
  }

  addOrder() {
    const db = getDB();
    return this.getCart().then(products => {
      const orders = {
        items: products,
        user: {
          id: new ObjectId(this._id),
          name: this.name,
        },
      };
      return db.collection('orders').insertOne(orders)
    })
    .then(() => {
      this.cart = { items: []}
      return db
      .collection('users')
      .updateOne(
        { _id: this._id},
        {$set: { cart: {items: []} }}
      )
    }).catch((err) => {
      
    });
  }

  getOrders() {
    const db = getDB();
    return db.collection('orders')
    .find({ 'user.id': new ObjectId(this._id) })
    .toArray()
    .then((orders) => {
      console.log('orders from get orders', orders)
      return orders
    }).catch((err) => {
      console.log('ERROR GETTING PRODUCT CART', err)
    });
  }
}


module.exports = User