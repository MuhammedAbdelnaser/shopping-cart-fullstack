const Product = require('../models/product');
const Order = require('../models/order');


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
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render("shop/cart", {
            path: '/cart',
            pageTitle: 'Your Cart',
            products
          })
        })
        .catch(err => {
          console.log('Error getting Products from cart', err)
        });
    })
    .catch(err => {
      console.log('Error getting a cart', err)
    })
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user.
    getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1
        return product;
      }
      return Product.findByPk(productId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity
        }
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log('Error Adding product to cart', err)
    })
}

exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({
        where: {
          id: productId
        }
      })
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy()
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log('Error deleting cart item', err)
    })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }))
        })
        .catch(err => {
          console.log('Error creating order', err)
        })
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log('Error creating order', err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products']})
    .then(orders => {
      console.log('orders', orders)
      res.render("shop/orders", {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      })
    }
    )
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
  Product.findOne({
    id: productId
  })
    .then(product => {
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: `/products${productId}`,
        product
      })
    }).catch(err => {
      console.log('Error fetching product', err)
    })
}