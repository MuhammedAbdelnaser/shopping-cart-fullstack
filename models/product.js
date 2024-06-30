const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)

const getProductsFromFile = cb => {
  return fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id
        )
        if (existingProductIndex !== -1) {
          const updatedProducts = [...products];
          updatedProducts[existingProductIndex] = this;
          fs.writeFile(p, JSON.stringify(updatedProducts, null, 2), (err) => {
            console.log('Error from existing product save:', err);
          });
        } else {
          console.error('Product ID not found in the products list.');
        }
      } else {
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
          console.log('Error from created product save:', err);
        });
      }
    })

  }

  static deleteById(id) {
    console.log('id', id)
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id)
      console.log('product', product)
      const updatedProduct = products.filter(prod => prod.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProduct, null, 2), err => {
        console.log('Error Deleting Item', err)
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product)
    })
  }
};
