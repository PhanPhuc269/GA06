const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");
const Order = require("@components/order/models/Order");
const Transaction = require("@components/transaction/models/Transaction");
const dotenv = require('dotenv');
const {  checkPaid } = require('../../../utils/payment');
const { mongooseToObject } = require('../../../utils/mongoose');
const TransactionService = require("../services/TransactionService");


dotenv.config(); // Load environment variables

require('dotenv').config(); // Load environment variables from .env

class TransactionController{


async getQrTransaction(req, res, next) {
    try {
        const { _id: transactionId } = req.params; // Lấy transactionId từ URL params

        console.log('giao dịch: ',transactionId);
        // Tìm giao dịch dựa trên transactionId
        const transaction = await TransactionService.getTransactionById(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Tạo thông tin QR Code dựa trên giao dịch
        const bankInfo = {
            id: process.env.BANK_ID,
            accountNo: process.env.ACCOUNT_NO,
            accountName: process.env.ACCOUNT_NAME,
            template: process.env.TEMPLATE,
        };

        const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${transaction.amount}&addInfo=${encodeURIComponent(transaction.description)}&accountName=${bankInfo.accountName}`;

        // Render file transaction.hbs với các thông tin cần thiết
        res.render('transaction', {
            qrCode: qrCodeData,
            amount: transaction.amount,
            description: transaction.description,
            transactionId:transaction._id,
        });
    } catch (error) {
        console.error('Error retrieving QR transaction:', error);
        res.status(500).json({ message: 'Error retrieving QR transaction', error });
    }
}



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