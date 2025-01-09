const e = require("connect-flash");

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ localStorage
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
        <span class="order-total">$${productTotal.toFixed(2)}</span>
    </div>
`;

        orderItemsContainer.appendChild(productItem);
    });

    // Cập nhật Subtotal và Total
    const total = subtotal + shippingCost;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Form validation
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', function (event) {
        let valid = true;
        const inputs = form.querySelectorAll('input[required], textarea');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }

            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    valid = false;
                    input.classList.add('error');
                }
            }

            if (input.id === 'phoneNumber') {
                const phoneRegex = /^\d{10,15}$/;
                if (!phoneRegex.test(input.value)) {
                    valid = false;
                    input.classList.add('error');
                }
            }

            if (input.id === 'zip') {
                const zipRegex = /^\d{5,10}$/;
                if (!zipRegex.test(input.value)) {
                    valid = false;
                    input.classList.add('error');
                }
            }
        });

        if (!valid) {
            event.preventDefault();
            alert('Please correct the errors in the form.');
        }
    });
});

// Lấy các sản phẩm trong giỏ hàng từ localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];




