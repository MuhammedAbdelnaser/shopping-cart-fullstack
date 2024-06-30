const Product = require('../models/product');
const Cart = require('../models/cart');


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
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({product, quantity: cartProductData.quantity, totalPrice: product.price * cartProductData.quantity })
        }
      }
      console.log('cartProducts', cartProducts)
      res.render("shop/cart", {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price)
  })

  res.redirect('/cart')
}

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price)
    res.redirect('/cart')
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