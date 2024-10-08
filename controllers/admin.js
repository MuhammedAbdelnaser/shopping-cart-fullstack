const Product = require('../models/product');
const { validationResult } = require('express-validator');


exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/')
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    product: [],
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, price, description, imageUrl} = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
        imageUrl,
      },
      errorMessage: errors.array()[0].msg
    })
  }

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
    const error = new Error(err);
    error.httpStatusCode = 500
    return next(error)
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
      editing: editMode,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    })
  }).catch(() => {
      const error = new Error(err);
      error.httpStatusCode = 500
      return next(error)
  })
  
}

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        _id: productId,
        title,
        imageUrl,
        description,
        price
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
    
  }

  Product.findById(productId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save()
      .then(() => {
        console.log('PRODUCT UPDATED SUCCESSFULLY')
        res.redirect('/admin/products')
      })
    })
    .catch(() => {
      const error = new Error(err);
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteOne({
    _id: productId,
    userId: req.user._id
  })
  .then(() => {
    console.log('PRODUCT DELETED SUCCESSFULLY')
    res.redirect('/admin/products')
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
  .then(products => {
    res.render("admin/products", {
      pageTitle: "Products page for Admin",
      path: '/admin/products',
      prods: products,
      
    })
  }).catch(err => {
    console.log('Error loading Admin Products', err)
  })
}