const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  })
}

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description } = req.body
  const product = new Product(title, imageUrl, description, price)

  product.save()
  res.redirect('/')
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