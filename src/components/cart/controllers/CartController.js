const Cart = require("@components/cart/models/Cart");
const Product = require("@components/product/models/Product");


class CartController{
    ViewShoppingCart(req, res, next) {
        res.render('cart');
    } 

  // API đồng bộ giỏ hàng khi login
  async  syncCart(req, res) {
    try {
        const { items } = req.body;
        const userId = req.user._id;
        console.log(items);
        const cartItems = [];
        for (const item of items) {
            const product = await Product.findOne({ slug: item.slug });

            if (!product) {
                return res.status(400).json({ message: `Không tìm thấy sản phẩm: ${item.slug}` });
            }

            cartItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }
        console.log(cartItems);
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: cartItems });
        } else {
            cart.items = cartItems; // Ghi đè toàn bộ items
        }

        await cart.save();
        res.status(200).json({ message: 'Đồng bộ giỏ hàng thành công', cart });
    } catch (error) {
        console.error('Lỗi đồng bộ giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi khi đồng bộ giỏ hàng', error: error.message });
    }
}

async updateCartBatch(req, res) {
    const userId = req.user._id; // Giả định có userId từ middleware xác thực
    const updates = req.body.updates; // Danh sách thay đổi từ client

    // Kiểm tra updates
    if (!Array.isArray(updates)) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    try {
        const dbCart = await Cart.findOne({ userId });
        if (!dbCart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Xử lý từng thay đổi bằng vòng lặp for
        for (const update of updates) {
            const dbItem = dbCart.items.find(
                (item) => item.slug === update.slug
            );

            if (dbItem) {
                // Cập nhật số lượng hoặc giá
                dbItem.quantity = update.quantity || dbItem.quantity;
                dbItem.price = update.price || dbItem.price;
                // Nếu số lượng là 0, xóa sản phẩm khỏi giỏ hàng
                if (update.quantity === 0) {
                    dbCart.items = dbCart.items.filter(
                        (item) => item.slug !== update.slug
                    );
                }
            } else {
                // Thêm sản phẩm mới nếu chưa có
                if (update.quantity > 0) {
                    dbCart.items.push(update);
                }
            }
        }

        // Lưu thay đổi vào DB
        await dbCart.save();
        res.status(200).json({ message: 'Cập nhật giỏ hàng thành công' });
    } catch (error) {
        console.error('Lỗi cập nhật giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi cập nhật giỏ hàng' });
    }
}




}

module.exports = new CartController();