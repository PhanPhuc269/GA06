document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const shippingCost = 50; // Flat shipping rate
    let subtotal = 0;

    // Xóa dữ liệu cũ trong danh sách sản phẩm
    orderItemsContainer.innerHTML = '';

    // Hiển thị danh sách sản phẩm từ giỏ hàng
    cart.forEach(item => {
        const productTotal = item.price * item.quantity;
        subtotal += productTotal;

        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <div class="order-item">
                <span class="order-name">${item.name}</span>
                <span class="order-quantity">x ${item.quantity}</span>
                <span class="order-total">VND ${productTotal.toFixed(2)}</span>
            </div>
        `;
        orderItemsContainer.appendChild(productItem);
    });

    // Cập nhật Subtotal và Total
    const total = subtotal + shippingCost;
    subtotalElement.textContent = `VND ${subtotal.toFixed(2)}`;
    totalElement.textContent = `VND ${total.toFixed(2)}`;
});
