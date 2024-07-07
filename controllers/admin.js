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
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  }).then( () => {
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

  req.user
  .getProducts({
    where: { id: productId }
  }).then(products => {
    const product = products[0]
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

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      // Handle the case where the product does not exist
      console.log('Product not found');
      return res.redirect('/');
    }

    product.title = title;
    product.imageUrl = imageUrl;
    product.description = description;
    product.price = price;

    await product.save()
    .then(() => {
      res.redirect('/admin/products')
      console.log('PRODUCT UPDATED SUCCESSFULLY')
    })
  } catch (err) {
    console.log('Error Editing Product', err)
  }

}

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByPk(productId)
  .then(product => {
    return product.destroy()
  })
  .then(() => {
    console.log('PRODUCT DELETED SUCCESSFULLY')
    res.redirect('/admin/products')
  }).catch(err => {
    console.log('Error Deleting Product', err);
  })
}

exports.getProducts = (req, res, next) => {
  
  req.user
  .getProducts().then(products => {
    res.render("admin/products", {
      pageTitle: "Products page for Admin",
      path: '/admin/products',
      products
    })
  }).catch(err => {
    console.log('Error loading Admin Products', err)
  })
}