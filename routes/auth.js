const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth')
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login', 
  [
    body('email', 'Please enter a valid email')
      .isEmail()
      .normalizeEmail(),
      body('password', 'Invalid password').isLength({
        min: 6
      })
      .isAlphanumeric()
      .trim(),
  ], 
  authController.postLogin
);

router.post('/signup',
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom(async (value, {err}) => {
          // if (value === 'test@test.com') {
          //   throw new Error('This email address is forbidden')
          // }
          // return true
          return User.findOne({ email: value })
          .then(userDoc => {
            if(userDoc) {
              return Promise.reject('E-Mail exists already, please pick a different one.')
            }
          })
        })
        ,
        body('password', 'Please enter a password with numbers and letter and at least 6 characters').isLength({
          min: 6
        })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword').trim().custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('2 Passwords are not matched')
          }
          return true
        })
    ]
    ,
    authController.postSignup
  );

router.post('/logout', authController.postLogout);

router.post('/reset-password', authController.postReset);

router.get('/reset-password', authController.getReset);

router.get('/reset-password/:token', authController.getResetNewPassword);

router.post('/reset-new-password', authController.postResetNewPassword);

module.exports = router;