const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description } = req.body
  const product = new Product(null, title, imageUrl, description, price)
  
  product.save()
  res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/')
  }
  const { productId } = req.params
  Product.findById(productId, product => {
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

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  )

  updatedProduct.save()

  res.redirect('/admin/products')

}

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.deleteById(productId)
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Products page for Admin",
      path: '/admin/products',
      products
    })
  })
  return products
}