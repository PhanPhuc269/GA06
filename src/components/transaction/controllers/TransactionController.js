const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");
const Order = require("@components/order/models/Order");
const Transaction = require("@components/transaction/models/Transaction");
const dotenv = require('dotenv');
const {  checkPaid } = require('../../../utils/payment');
const { mongooseToObject } = require('../../../utils/mongoose');


dotenv.config(); // Load environment variables

require('dotenv').config(); // Load environment variables from .env

class TransactionController{


//     // ViewShoppingCart(req, res, next) {
//     //     res.render('cart');
//     // } 

//    // Lấy danh sách giao dịch của người dùng
//    async getTransactionsByUser(req, res, next) {
//     try {
//         const userId = req.user._id; // ID người dùng từ token

//         // Truy xuất các giao dịch
//         const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

//         if (!transactions.length) {
//             return res.status(404).json({ message: 'No transactions found' });
//         }

//         res.status(200).json({
//             message: 'Transactions retrieved successfully',
//             transactions,
//         });
//     } catch (error) {
//         console.error('Error retrieving transactions:', error);
//         res.status(500).json({ message: 'Error retrieving transactions', error });
//     }
// }

// async getQrTransaction(req, res, next) {
//     try {
//         const { _id: transactionId } = req.params; // Lấy transactionId từ URL params

//         console.log('giao dịch: ',transactionId);
//         // Tìm giao dịch dựa trên transactionId
//         const transaction = await Transaction.findById(transactionId);
//         if (!transaction) {
//             return res.status(404).json({ message: 'Transaction not found' });
//         }

//         // Tạo thông tin QR Code dựa trên giao dịch
//         const bankInfo = {
//             id: process.env.BANK_ID,
//             accountNo: process.env.ACCOUNT_NO,
//             accountName: process.env.ACCOUNT_NAME,
//             template: process.env.TEMPLATE,
//         };

//         const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${transaction.amount}&addInfo=${encodeURIComponent(transaction.description)}&accountName=${bankInfo.accountName}`;

//         // Render file transaction.hbs với các thông tin cần thiết
//         res.render('transaction', {
//             qrCode: qrCodeData,
//             amount: transaction.amount,
//             description: transaction.description,
//             transactionId:transaction._id,
//         });
//     } catch (error) {
//         console.error('Error retrieving QR transaction:', error);
//         res.status(500).json({ message: 'Error retrieving QR transaction', error });
//     }
// }

// // Tạo giao dịch thanh toán
// // async createTransaction(req, res, next) {
// //     try {
// //         const { orderId } = req.body; // Nhận orderId và paymentMethod từ request
// //         const customerId = req.user._id; // Lấy ID người dùng từ token
// //         console.log('user: ',customerId);
// //         // Tìm đơn hàng trong cơ sở dữ liệu
// //         const order = await Order.findById(orderId);
// //         if (!order) {
// //             return res.status(404).json({ message: 'Order not found' });
// //         }

// //         // Lấy tổng tiền từ đơn hàng
// //         const amount = order.totalAmount;
// //         if (!amount || amount <= 0) {
// //             return res.status(400).json({ message: 'Invalid total amount in order' });
// //         }

// //         // Tạo giao dịch mới với trạng thái "pending"
// //         const newTransaction = new Transaction({
// //             customerId:customerId,
// //             amount,
// //             paymentMethod:'bank',
// //             orderId,
// //             description: `OrderID-${orderId}`, // Mô tả ban đầu
// //             status: 'pending',
// //         });

// //         // Lưu giao dịch vào cơ sở dữ liệu
// //         //const savedTransaction = await newTransaction.save();
// //         await newTransaction.save();
// //         // Trả về giao dịch đã tạo
// //         res.status(201).json({
// //             message: 'Transaction created successfully',
// //             transaction: newTransaction,
// //         });
// //     } catch (error) {
// //         console.error('Error creating transaction:', error);
// //         res.status(500).json({ message: 'Error creating transaction', error });
// //     }
// // }

// async createTransaction(req, res, next) {
//     try {
//         const { orderId } = req.body; // Nhận orderId từ request
//         const customerId = req.user._id; // Lấy ID người dùng từ token

//         // Tìm đơn hàng trong cơ sở dữ liệu
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Lấy tổng tiền từ đơn hàng
//         const amount = order.totalAmount;
//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Invalid total amount in order' });
//         }

//         // Tạo giao dịch mới với trạng thái "pending"
//         const newTransaction = new Transaction({
//             customerId: customerId,
//             amount,
//             paymentMethod: 'bank',
//             orderId,
//             description: `OrderID-${orderId}`, // Mô tả ban đầu
//             status: 'pending',
//         });

//         // Lưu giao dịch vào cơ sở dữ liệu
//         await newTransaction.save();

//         // Tạo thông tin QR Code
//         const bankInfo = {
//             id: process.env.BANK_ID,
//             accountNo: process.env.ACCOUNT_NO,
//             accountName: process.env.ACCOUNT_NAME,
//             template: process.env.TEMPLATE,
//         };

//         //const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${newTransaction.amount}&addInfo=${encodeURIComponent(newTransaction.description)}&accountName=${bankInfo.accountName}`;
//         const _id=newTransaction._id;
//         // Render trang QR code với dữ liệu giao dịch
//         res.redirect(`/transaction/processPayment/${_id}`);
//     } catch (error) {
//         console.error('Error creating transaction:', error);
//         res.status(500).json({ message: 'Error creating transaction', error });
//     }
// }


// // Xử lý thanh toán và cập nhật trạng thái giao dịch
// // Xử lý thanh toán và cập nhật trạng thái giao dịch
// async processPayment(req, res, next) {
//     try {
//         const { transactionId } = req.body;
//         const userId = req.user._id;

//         const transaction = await Transaction.findById(transactionId);
//         if (!transaction) {
//             return res.status(404).json({ message: 'Transaction not found' });
//         }

//         if (transaction.status !== 'pending') {
//             return res.status(400).json({ message: 'Transaction is not pending' });
//         }

//         // Khởi tạo thời gian và interval
//         const timeout = 5 * 60 * 1000; // 5 phút
//         const checkInterval = 10 * 1000; // Kiểm tra mỗi 10 giây
//         let elapsed = 0;

//         // Vòng lặp kiểm tra trạng thái thanh toán
//         while (elapsed < timeout) {
//             const isPaid = await checkPaid(transaction.amount, transaction.description); // Hàm kiểm tra từ API ngân hàng

//             if (isPaid.success) {
//                 // Nếu thanh toán thành công
//                 transaction.status = 'completed';
//                 await transaction.save();

//                 // Cập nhật trạng thái order
//                 const order = await Order.findById(transaction.orderId);
//                 if (order) {
//                     order.status = 'completed';
//                     await order.save();
//                 }

//                 return res.json({ message: 'Transaction completed successfully', transaction });
//             }

//             // Nếu chưa thanh toán, đợi và tiếp tục kiểm tra
//             await new Promise(resolve => setTimeout(resolve, checkInterval));
//             elapsed += checkInterval;
//         }

//         // Nếu hết thời gian mà chưa thanh toán
//         transaction.status = 'failed';
//         await transaction.save();

//         return res.status(400).json({ message: 'Payment failed: Timeout exceeded' });
//     } catch (error) {
//         console.error('Error processing payment:', error);
//         res.status(500).json({ message: 'Error processing payment', error });
//     }
// }

async getTransactionsByUser(req, res, next) {
    try {
        const userId = req.user._id;
        const transactions = await TransactionService.getTransactionsByUser(userId);

        if (!transactions.length) {
            return res.status(404).json({ message: "No transactions found" });
        }

        res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async createTransaction(req, res, next) {
    try {
        const { orderId } = req.body;
        const customerId = req.user._id;
        const newTransaction = await TransactionService.createTransaction(orderId, customerId);
        res.redirect(`/transaction/processPayment/${newTransaction._id}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async processPayment(req, res, next) {
    try {
        const { transactionId } = req.body;
        const transaction = await TransactionService.processPayment(transactionId);
        res.status(200).json({
            message: "Transaction completed successfully",
            transaction,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async getAllTransactions(req, res, next) {
    try {
        const transactions = await TransactionService.getAllTransactions();
        res.status(200).json({
            message: 'All transactions retrieved successfully',
            transactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


}

module.exports = new TransactionController();