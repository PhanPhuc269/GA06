document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const shippingCost = 50; // Flat shipping rate
    let subtotal = 0;

    // Xóa dữ liệu cũ trong danh sách sản phẩm
    orderItemsContainer.innerHTML = "";

    // Hiển thị danh sách sản phẩm từ giỏ hàng
    cart.forEach((item) => {
        const productTotal = item.price * item.quantity;
        subtotal += productTotal;

        const productItem = document.createElement("li");
        productItem.classList.add("order-item");
        productItem.innerHTML = `
             <div class="order-product d-flex align-items-center">
                <a href="/product/product-details/${item.slug}" style="text-decoration: none;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </a>
                <div>
                    <a href="/product/product-details/${item.slug}" style="text-decoration: none; color: #000;">
                        <h6>${item.name}</h6>
                    </a>
                    <p>Size: ${item.size}, Color: ${item.color}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="ml-auto">
                    <span>VND ${productTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(productItem);
    });

    // Cập nhật Subtotal và Total
    const total = subtotal + 0;
    subtotalElement.textContent = `VND ${subtotal.toFixed(2)}`;
    totalElement.textContent = `VND ${total.toFixed(2)}`;
});
