const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {

  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct;
      // Add new product or increase quantity
      if (existingProduct) {
        updatedProduct = {...existingProduct, quantity: existingProduct.quantity + 1 }
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id, quantity: 1}
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +productPrice 
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log('err', err)
      })
    })
  }
  
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = {...JSON.parse(fileContent)}
      console.log('cart', cart)
      const product = cart.products.find(prod => prod.id === id)
      if (!product) {
        return;
      }
      const productQuantity = product.quantity
      cart.products = cart.products.filter(product => product.id !== id)
      cart.totalPrice -= (productQuantity * productPrice)
      
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log('err', err)
      })
    })
  }

  static getProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if(err) {
        cb([])
      } else {
        cb(cart)
      }
    })
  }
}