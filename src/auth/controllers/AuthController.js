const { mutipleMongooseToObject } = require('@utils/mongoose');
const { mongooseToObject } = require('@utils/mongoose');
const session = require('express-session');
const User = require('../models/User');
const crypto = require('crypto');
const Product = require("@components/product/models/Product");
const passport = require('passport');

class AuthController{
    viewRegistration(req,res,next){
        res.render('registration');
    }
    async register(req, res,next){
        const { username, email, password, rePassword } = req.body;
        try {
            if (password !== rePassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
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
    // [GET] /login
    viewLogin(req, res, next) {
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        const email = req.flash('email')[0] || '';
        res.render('login', { email });
    }
    // [POST] /login
    async login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error_msg', 'Sai email hoặc mật khẩu');
                req.flash('email', req.body.email);
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
    // [GET] /logout
    logout (req, res,next){
        req.logout((err) => {
            if (err) {
                return res.status(500).send('Error logging out');
            }
            res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        });
    };

}

module.exports = new AuthController();