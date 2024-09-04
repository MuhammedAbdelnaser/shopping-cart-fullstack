const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.find()
  .then((prods) => {
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
  Product.find().then((products) => {
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
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render("shop/cart", {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      })
    })
    .catch(err => {
      console.log('Error getting Products from cart', err)
    });
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
  .then(product => {
    console.log('product from shop', product, productId)
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log('result', result)
    res.redirect('/cart')
  })
  .catch((err) => {
    console.log('Error Post Cart', err)
  });
}

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
  .then(product => {
    console.log('product from post deleteCartItem', product, productId)
    return req.user.deleteCartItem(productId)
  })
  .then((result) => {
    console.log('DELETE CART ITEM', result)
    res.redirect('/cart')
  })
  .catch(err => {
    console.log('Error deleting cart item', err)
  })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          product: {...i.productId._doc},
          quantity: i.quantity
        }
      })
      const order = new Order({
        products,
        user: {
          name: req.user.name,
          userId: req.user
        }
      })
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log('Error creating order', err)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
  .then(orders => {
      console.log('orders', orders)
      res.render("shop/orders", {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      })
    })
    .catch(err => {
      console.log('Error getting orders', err)
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
  Product.findById(productId)
    .then(product => {
      console.log(product)
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: `/products${productId}`,
        product
      })
    }).catch(err => {
      console.log('Error fetching product', err)
    })
}