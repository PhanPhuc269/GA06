document.addEventListener("DOMContentLoaded", () => {
    const cartCountElement = document.getElementById("cart-count");

    // Kiểm tra nếu phần tử đếm số lượng giỏ hàng tồn tại
    if (!cartCountElement) {
        console.warn("Cart count element not found.");
        return;
    }

    // Hàm tính tổng số lượng sản phẩm trong giỏ
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    // Cập nhật số lượng khi trang được tải
    updateCartCount();

    // Nếu có thao tác thêm hoặc xóa giỏ hàng ở các file khác, bạn có thể gọi lại hàm `updateCartCount` để cập nhật.
});
