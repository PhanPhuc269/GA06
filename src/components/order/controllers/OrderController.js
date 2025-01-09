const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");
const Order = require("@components/order/models/Order");

const OrderService = require('../services/OrderService');

class OrderController {
    ViewProductCheckout(req, res, next) {
        res.render('checkout');
    }

    async ViewOrderList(req, res, next) {
        try {
            const customerId = req.user._id;
           
            const orders = await OrderService.getOrdersByCustomerId(customerId);
            res.render('orderList', {
                orders: mutipleMongooseToObject(orders),
            });
        } catch (error) {
            next(error);
        }
    }

    async ViewOrderDetail(req, res, next) {
        try {
            const orderId = req.params._id;
            const order = await OrderService.getOrderDetails(orderId);

            if (!order) {
                return res.status(404).send('Không tìm thấy đơn hàng.');
            }

            res.render('orderDetail', {
                order: mongooseToObject(order),
            });
        } catch (error) {
            console.error('Error fetching order details:', error);
            res.status(500).send('Lỗi server.');
        }
    }

    

    async addOrder(req, res, next) {

        // Inline validation
        const errors = [];
        const {
            firstName, lastName, phoneNumber, email,
            addressLine1, city, district, zip, orderNotes
        } = req.body;

        // Validate First Name
        if (!firstName || !firstName.trim()) {
            errors.push({ msg: 'First name is required.' });
        }

        // Validate Last Name
        if (!lastName || !lastName.trim()) {
            errors.push({ msg: 'Last name is required.' });
        }

        // Validate Phone Number
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            errors.push({ msg: 'Phone number must be between 10 to 15 digits.' });
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push({ msg: 'Invalid email address.' });
        }

        // Validate Address Line 1
        if (!addressLine1 || !addressLine1.trim()) {
            errors.push({ msg: 'Address line 1 is required.' });
        }

        // Validate City
        if (!city || !city.trim()) {
            errors.push({ msg: 'City is required.' });
        }

        // Validate District
        if (!district || !district.trim()) {
            errors.push({ msg: 'District is required.' });
        }

        // Validate Zip Code
        const zipRegex = /^\d{5,10}$/;
        if (!zip || !zipRegex.test(zip)) {
            errors.push({ msg: 'Zip code must be between 5 to 10 digits.' });
        }

        // If there are validation errors, render the checkout page with errors
        if (errors.length > 0) {
            return res.status(400).render('checkout', {
                errors,
                oldInput: req.body
            });
        }

        
        
        try {
            const userId = req.user._id;
            const {
                firstName, lastName, phoneNumber, email,
                addressLine1,  city, district, zip, orderNotes
            } = req.body;

            const orderData = {
                firstName,
                lastName,
                phoneNumber,
                email,
                addressLine1,              
                city,
                district,
                zip,
                orderNotes
            };

            const newOrder = await OrderService.createOrder(userId, orderData);

            res.redirect(`/order/list`);
        } catch (error) {
            console.error(error);
            res.status(500).render('errorOrder', {
                message: 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.',
                errorCode: 500,
                errorDetails: error.message
            });
        }
    }
}

module.exports = new OrderController();



