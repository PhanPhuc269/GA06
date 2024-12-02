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
});

// Lấy các sản phẩm trong giỏ hàng từ localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Lắng nghe sự kiện gửi form
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Ngừng submit mặc định

    // Lấy dữ liệu từ form
    const formData = new FormData(this);

    // Lấy danh sách sản phẩm từ localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Thêm items vào FormData
    formData.append('items', JSON.stringify(cartItems));  // Chuyển items thành chuỗi JSON và thêm vào formData

    // Gửi dữ liệu qua AJAX
    fetch('/order/checkout', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
        // Xử lý kết quả trả về sau khi gửi form thành công
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        // Xử lý lỗi nếu có
    });
});

