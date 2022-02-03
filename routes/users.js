const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const expressValidator = require('express-validator');
router.use(expressValidator());

router.route('/register')
    .get(users.renderRegister)
    .post(validator, catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;

function validator(req, res, next){
    req.checkBody('username').isLength({ min: 6, max:24 }).withMessage('Username must be between 6 and 24 characters');
    req.checkBody('email').isEmail().withMessage('Email must be valid.');
    req.checkBody('password').isLength({ min: 6, max:24 }).withMessage('Password must be between 6 and 24 characters');
    //validate 
    let errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors[0].msg)
        res.redirect('register')
    } else {
      next();
    }
}