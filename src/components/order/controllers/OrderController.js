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
            console.log('đơn hàng:' ,orders);
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
    
            // Xóa giỏ hàng của người dùng sau khi đặt hàng thành công
           // await Cart.deleteOne({ userId });
    
            // Trả về kết quả thành công
            res.redirect(`/order/list`);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Lỗi khi tạo đơn hàng.',
                error: error.message
            });
        }
    };

     async viewPayment(req, res, next) {
        try {
            const orderId = req.query.orderId; // Lấy orderId từ query parameter
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).render('error', { message: 'Không tìm thấy đơn hàng!' });
            }

            const bankInfo = {
                id: process.env.BANK_ID,
                accountNo: process.env.ACCOUNT_NO,
                accountName: process.env.ACCOUNT_NAME,
                template: process.env.TEMPLATE,
            };

            const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(order._id)}&accountName=${bankInfo.accountName}`;

            res.render('payment', {
                order: mongooseToObject(order),
                qrCode: qrCodeData,
            });
        } catch (error) {
            console.error('Error viewing payment:', error);
            res.status(500).render('error', { message: 'Có lỗi xảy ra khi hiển thị thanh toán.' });
        }
    }

    // Xử lý thanh toán
    async processPayment(req, res, next) {
        try {
            const { transactionId } = req.body;
            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
            }

            if (transaction.status !== 'pending') {
                return res.status(400).json({ message: 'Giao dịch không còn ở trạng thái đang chờ!' });
            }

            const checkInterval = 10 * 1000; // 10 giây
            const timeout = 5 * 60 * 1000; // 5 phút
            let elapsed = 0;

            const checkPaymentStatus = async () => {
                if (elapsed >= timeout) {
                    transaction.status = 'failed';
                    await transaction.save();
                    console.log('Transaction failed due to timeout:', transactionId);
                    return res.status(400).json({ message: 'Quá thời gian chờ thanh toán.' });
                }

                // Giả định `checkPaid` là một hàm kiểm tra trạng thái thanh toán
                const isPaid = await checkPaid(transaction.amount, transaction.description);
                if (isPaid.success) {
                    transaction.status = 'completed';
                    await transaction.save();
                    console.log('Transaction completed successfully:', transactionId);
                    return res.json({ message: 'Thanh toán thành công!', transaction });
                }

                elapsed += checkInterval;
                setTimeout(checkPaymentStatus, checkInterval);
            };

            checkPaymentStatus();
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý thanh toán.', error });
        }
    }
}

module.exports = new OrderController();