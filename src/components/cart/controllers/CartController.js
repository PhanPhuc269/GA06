const CartService = require("@components/cart/services/CartService");
const ProductService = require("@components/product/services/ProductService");

class CartController {
    ViewShoppingCart(req, res, next) {
        res.render("cart");
    }

    // API đồng bộ giỏ hàng khi login
    async syncCart(req, res) {
        try {
            const { items } = req.body;
            const userId = req.user._id;

            const cartItems = [];
            for (const item of items) {
                const product = await ProductService.getProductBySlug(item.slug);

                if (!product) {
                    return res
                        .status(400)
                        .json({ message: `Không tìm thấy sản phẩm: ${item.slug}` });
                }

                cartItems.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }

            const cart = await CartService.updateCart(userId, cartItems);
            res.status(200).json({ message: "Đồng bộ giỏ hàng thành công", cart });
        } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng:", error);
            res.status(500).json({ message: "Lỗi khi đồng bộ giỏ hàng", error: error.message });
        }
    }

    async updateCartBatch(req, res) {
        const userId = req.user._id; // Giả định có userId từ middleware xác thực
        const updates = req.body.updates; // Danh sách thay đổi từ client

        if (!Array.isArray(updates)) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }

        try {
            const dbCart = await CartService.findCartByUserId(userId);
            if (!dbCart) {
                return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
            }

            const updatedItems = dbCart.items.map((item) => {
                const update = updates.find((u) => u.slug === item.slug);
                if (update) {
                    return {
                        ...item,
                        quantity: update.quantity || item.quantity,
                        price: update.price || item.price,
                    };
                }
                return item;
            });

            // Thêm sản phẩm mới nếu chưa có
            updates.forEach((update) => {
                if (!dbCart.items.find((item) => item.slug === update.slug) && update.quantity > 0) {
                    updatedItems.push(update);
                }
            });

            // Loại bỏ sản phẩm có số lượng = 0
            const finalItems = updatedItems.filter((item) => item.quantity > 0);

            const cart = await CartService.updateCart(userId, finalItems);
            res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cart });
        } catch (error) {
            console.error("Lỗi cập nhật giỏ hàng:", error);
            res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
        }
    }
}

module.exports = new CartController();
