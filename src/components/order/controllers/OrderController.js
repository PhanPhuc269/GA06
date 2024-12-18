const { mutipleMongooseToObject } = require('../../../utils/mongoose');
const { mongooseToObject } = require('../../../utils/mongoose');
const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");
const Order = require("@components/order/models/Order");

class OrderController{
    ViewProductCheckout(req, res, next) {
        res.render('checkout');
    }

    
    async ViewOrderList(req, res, next) {
            try {
                const customerId = req.user._id; // Lấy userId từ session hoặc JWT
                console.log('user: ',customerId);
                const orders = await Order.find({ customerId }); // Lấy danh sách đơn hàng từ DB
         //   console.log('đơn hàng:' ,orders);
                res.render('orderList', {  orders: mutipleMongooseToObject(orders), }); // Truyền danh sách đơn hàng vào view
            } catch (error) {
                next(error); // Xử lý lỗi (có thể hiển thị trang lỗi hoặc thông báo)
            }
        }

    async ViewOrderDetail(req, res, next) {
        const orderId = req.params._id;

        // Lấy chi tiết đơn hàng, bao gồm thông tin chi tiết của sản phẩm
        const order = await Order.findById(orderId)
            .populate('items.productId'); // populate để lấy thông tin sản phẩm

        if (!order) {
            return res.status(404).send('Không tìm thấy đơn hàng.');
        }

        res.render('orderDetail', {  order: mongooseToObject(order), });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Lỗi server.');
    
        
    }
    
    addOrder = async (req, res) => {
        try {
            // Lấy user_id từ req.user (middleware xác thực phải cung cấp user_id)
            const userId = req.user._id;
    
            // Lấy giỏ hàng của người dùng
            const cart = await Cart.findOne({ userId }).populate('items.productId');
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({
                    message: 'Giỏ hàng trống. Không thể tạo đơn hàng.'
                });
            }
    
            // Tính tổng tiền từ giỏ hàng
            let totalAmount = 0;
            const items = cart.items.map(item => {
                const price = item.productId.price; // Lấy giá sản phẩm từ `Product`
                const quantity = item.quantity;
                totalAmount += price * quantity;
                return {
                    productId: item.productId._id,
                    quantity,
                    price
                };
            });
    
            // Cộng thêm phí vận chuyển
            const shippingFee = 50;
            totalAmount += shippingFee;
            console.log(req.body);
            // Lấy thông tin địa chỉ từ `req.body`
            const {
                firstName, lastName, phoneNumber, email,
                addressLine1, addressLine2, city, district, zip, orderNotes
            } = req.body;
    
            // Tạo đối tượng đơn hàng mới
            const newOrder = new Order({
                customerId: userId,
                firstName,
                lastName,
                phoneNumber,
                email,
                addressLine1,
                addressLine2,
                city,
                district,
                zip,
                orderNotes,
                items, // Lấy từ giỏ hàng
                totalAmount,
                shippingFee
            });
    
            // Lưu đơn hàng vào cơ sở dữ liệu
            await newOrder.save();
    
         
    
            // Trả về kết quả thành công
            res.redirect(`/order/list`);
        } catch (error) {
            console.error(error);
            // Hiển thị thông báo lỗi lên giao diện web
            res.status(500).render('errorOrder', {
                message: 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.',
                errorCode: 500,
                errorDetails: error.message // Chỉ hiển thị chi tiết lỗi nếu cần thiết
            });
        }
    };

   
}

module.exports = new OrderController();