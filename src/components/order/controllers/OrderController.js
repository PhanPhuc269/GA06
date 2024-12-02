const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
//const Product = require("../models/Product");

class CartController{
    ViewProductCheckout(req, res, next) {
        res.render('checkout');
    }
    addOrder = async (req, res) => {
        try {
            // Lấy dữ liệu từ body của yêu cầu (form)
            const { firstName, lastName, companyName, phoneNumber, email, country, 
                    addressLine1, addressLine2, city, district, zip, createAccount,
                    shipToDifferentAddress, orderNotes, couponCode, items } = req.body;
    
            // Tính tổng tiền đơn hàng
            let totalAmount = 0;
            // Kiểm tra nếu items có tồn tại
            if (!items || items.length === 0) {
                console.log("không có items");
                return res.status(400).json({
                    message: 'Không có sản phẩm trong đơn hàng.',
                });
            }
            items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });
    
            // Tính tổng cộng với phí vận chuyển
            totalAmount += 50; // Shipping fee (giả sử là 50)
    
            // Tạo một đối tượng Order
            const newOrder = new Order({
                firstName,
                lastName,
                companyName,
                phoneNumber,
                email,
                country,
                addressLine1,
                addressLine2,
                city,
                district,
                zip,
                createAccount,
                shipToDifferentAddress,
                orderNotes,
                couponCode,
                items,
                totalAmount,
                shippingFee: 50 // Phí vận chuyển cố định
            });
    
            // Lưu đơn hàng vào cơ sở dữ liệu
            await newOrder.save();
    
            // Trả về kết quả thành công
            res.status(200).json({
                message: 'Order placed successfully!',
                orderId: newOrder._id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error while placing order',
                error: error.message
            });
        }
    }
}

module.exports = new CartController();