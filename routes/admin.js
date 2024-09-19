const path = require('path');

const express = require('express');

const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => POST
router.post(
  '/add-product',
  isAuth,
  [
    body('title', 'Invalid product title, it must be at least 6 chars').isString().isLength({ min: 6 }).trim(),
    body('price', 'Price must be Number').isFloat(),
    body('description', 'description must be at least 20 chars and at most 400 chars').isString().isLength({ min: 20, max: 400 }).trim(),
    body('imageUrl', 'invalid image URL').isURL(),
  ],
  adminController.postAddProduct
)

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
  '/edit-product/', 
  [
    body('title', 'Invalid product title, it must be at least 6 chars').isString().isLength({ min: 6 }).trim(),
    body('price', 'Price must be Number').isFloat(),
    body('description', 'description must be at least 20 chars and at most 400 chars').isString().isLength({ min: 20, max: 400 }).trim(),
    body('imageUrl', 'invalid image URL').isURL(),
  ],
  isAuth,
  adminController.postEditProduct
)

router.post('/delete-product', isAuth, adminController.deleteProduct)

module.exports = router
