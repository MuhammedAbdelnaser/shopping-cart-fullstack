const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    t: req.body.title,
    price: req.body.price,
    description: req.body.description
  })

  product.save()
  console.log(req.body)
  // res.send(`
  //   <h1>${req.body.title}</h1>
  // `)
  res.redirect('/')
}

// exports.getProducts = (req, res, next) => {  
//   const products = Product.fetchAll()
//   //* render method is to render engine view which we set to pug and it will try to find all .pug files
//   res.render('shop', {
//     prods: products,
//     pageTitle: 'Shop',
//     path: '/',
//     hasProducts: products.length > 0,
//   })
// }

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render('shop', {
    pageTitle: "Shop",
    prods: products,
    path: "/",
    hasProducts: products.length > 0
  });
};