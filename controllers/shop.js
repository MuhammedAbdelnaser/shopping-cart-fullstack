const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list', {
      pageTitle: "All Products",
      prods: products,
      path: "/products"
    });
  });
  return products
};

exports.getIndex = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/index', {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  });
  return products
}

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: '/cart',
    pageTitle: 'Your Cart'
  })
}
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.getProduct = (req, res, next) => {
  const { productId } = req.params

  Product.findById(productId, product => {
    res.render("shop/product-details", {
      pageTitle: "Product Details",
      path: `/products${productId}`,
      product
    })
  })
}