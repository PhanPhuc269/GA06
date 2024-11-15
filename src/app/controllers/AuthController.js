const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const session = require('express-session');
const User = require('../models/User');
const crypto = require('crypto');
const Product = require("../models/Product");
const passport = require('passport');

class AuthController{
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

    async home(req, res, next) {
        try {
            const products = await Product.find();
            res.render('home', {
                products: mutipleMongooseToObject(products)
            });
            //console.log(products);
        } catch (error) {
            next(error);
        }
    }
    // [GET] /login
    viewLogin(req, res, next) {
        res.render('login');
    }
    // [POST] /login
    async login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',  // Chuyển hướng khi đăng nhập thành công
            failureRedirect: '/login', // Chuyển hướng khi đăng nhập thất bại
            failureFlash: true // Kích hoạt thông báo lỗi
          })(req, res, next);
    }
}

module.exports = new AuthController();