const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {type: Number, required: true}
    }],
  },
})

userSchema.methods.addToCart = function(product) {
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
      productId: product._id,
      quantity: newQuantity
    })
  }
  const updatedCart = {
    items: updatedCartItems
  }
  this.cart = updatedCart
  return this.save();
}

userSchema.methods.getCart = function() {
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

userSchema.methods.deleteCartItem = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()
  })

  this.cart.items = updatedCartItems

  return this.save()
}

userSchema.methods.clearCart = function() {
  this.cart = { items: []};
  return this.save();
}

userSchema.methods.addOrder = function() {
  const db = getDB();
  return this.getCart()
  .then((products) => {
    const orders = {
      items: products,
      user: {
        id: this._id,
        name: this.name
      }
    }
    return db.collection('orders')
    .insertOne(orders)
  })
  .then(() => {
    this.cart = { items: []}
    return db
    .collection('users')
    .updateOne(
      { _id: this._id},
      {$set: { cart: {items: []} }}
    )
  })
  .catch((err) => {
    
  });
}

module.exports = mongoose.model('User', userSchema)
