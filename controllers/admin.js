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
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product.save().then( () => {
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
    const updatedTitle = title;
    const updatedPrice = price;
    const updatedDescription = description;
    const updatedImageUrl = imageUrl;
    
    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, productId);
    return product.save()
      .then(() => {
        res.redirect('/admin/products')
        console.log('PRODUCT UPDATED SUCCESSFULLY')
      })
      .catch(err => {
        console.log('Error Updating Product', err)
      })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteById(productId)
  .then(() => {
    console.log('PRODUCT DELETED SUCCESSFULLY')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log('Error Deleting Product', err);
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render("admin/products", {
      pageTitle: "Products page for Admin",
      path: '/admin/products',
      products
    })
  }).catch(err => {
    console.log('Error loading Admin Products', err)
  })
}