const { mutipleMongooseToObject } = require('@utils/mongoose');
const { mongooseToObject } = require('@utils/mongoose');
const session = require('express-session');
const User = require('../models/User');
const crypto = require('crypto');
const Product = require("@components/product/models/Product");
const passport = require('passport');

class AuthController{

    async home(req, res, next) {
        try {
            const onSaleProducts = await Product.find({ availibility: 'On Sale' });
            const notOnSaleProducts = await Product.find({ availibility: { $ne: 'On Sale' } });
    
            res.render('home', {
                onSaleProducts: mutipleMongooseToObject(onSaleProducts),
                notOnSaleProducts: mutipleMongooseToObject(notOnSaleProducts)
            });
        } catch (error) {
            next(error);
        }
    }
    viewRegistration(req,res,next){
        res.render('registration');
    }
    async register(req, res,next){
        const { username, email, password } = req.body;
        try {
            // Check if the username already exists
            const existingUser = await User.findOne({ username: username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            // Check if the email already exists
            const existingEmail = await User.findOne({ email: email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const user = new User({ username, password, email});
            await user.save();
            req.session.userId = user._id;
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            next(error);
        }
    }
    // [GET] /

    
    // [GET] /login
    viewLogin(req, res, next) {
        res.render('login');
    }
    // [POST] /login
    async login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error_msg', 'Sai tên đăng nhập hoặc mật khẩu');
                return res.redirect('/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }
}

module.exports = new AuthController();