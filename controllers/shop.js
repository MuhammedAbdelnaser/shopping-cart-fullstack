const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.findAll().then((prods) => {
    res.render('shop/product-list', {
      pageTitle: "All Products",
      prods,
      path: "/products"
    });
  }).catch(err => {
    console.log('Error Finding Products', err)
  })
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/index', {
      pageTitle: "Shop",
      prods: products,
      path: "/"
    });
  }).catch(err => {
    console.log('Error Finding Products', err)
  })
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
  Product.findOne({
    id: productId
  })
  .then(product => {
    console.log('product', product)
    res.render("shop/product-details", {
      pageTitle: product.title,
      path: `/products${productId}`,
      product
    })
  }).catch(err => {
    console.log('Error fetching product', err)
  })
}