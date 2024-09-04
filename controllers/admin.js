const mongodb = require('mongodb');
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, price, description, imageUrl} = req.body
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });
  product
  .save() // coming from mongoose
  .then( () => {
    console.log('Product Created Successfully')
    res.redirect('/')
  }).catch( err => {
    console.log('Error Creating Product', err)
  })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/')
  }
  const { productId } = req.params

  Product.findById(productId).then(product => {
    if (!product) {
      // Not the best UX as you should show the error to the user 
      return res.redirect('/')
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product,
      editing: editMode
    })
  })

}

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body
  Product.findById(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save()
    })
    .then(() => {
      console.log('PRODUCT UPDATED SUCCESSFULLY')
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log('Error Updating Product', err)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByIdAndDelete(productId)
  .then(() => {
    console.log('PRODUCT DELETED SUCCESSFULLY')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log('Error Deleting Product', err);
  })
}

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("admin/products", {
      pageTitle: "Products page for Admin",
      path: '/admin/products',
      prods: products
    })
  }).catch(err => {
    console.log('Error loading Admin Products', err)
  })
}