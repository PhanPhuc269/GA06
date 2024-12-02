document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");

    // Hàm cập nhật giỏ hàng
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;

        // Nếu giỏ hàng rỗng, hiển thị thông báo
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5">Your cart is empty!</td>
                </tr>`;
            updateTotalPrice(0);
            return;
        }

        // Duyệt qua giỏ hàng và tạo các hàng trong bảng
        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            row.innerHTML = `
                <td>
                    <div class="media">
                        <div class="d-flex">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                        </div>
                        <div class="media-body">
                            <p>${item.name}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <h5>$${item.price.toFixed(2)}</h5>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button class="decrease-qty" data-slug="${item.slug}">-</button>
                        <input type="text" value="${item.quantity}" class="qty-input" data-slug="${item.slug}" readonly>
                        <button class="increase-qty" data-slug="${item.slug}">+</button>
                    </div>
                </td>
                <td>
                    <h5>$${itemTotal.toFixed(2)}</h5>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        // Hiển thị tổng giá
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="4" class="text-right"><strong>Total Price:</strong></td>
            <td><h5 id="cart-total">$${totalPrice.toFixed(2)}</h5></td>
        `;
        cartItemsContainer.appendChild(totalRow);
    }

    // Cập nhật tổng giá trong DOM
    function updateTotalPrice(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.innerText = `$${total.toFixed(2)}`;
        }
    }

    // Xử lý sự kiện tăng/giảm số lượng
    cartItemsContainer.addEventListener("click", (event) => {
        const slug = event.target.getAttribute("data-slug");

        if (event.target.classList.contains("increase-qty")) {
            const product = cart.find((item) => item.slug === slug);
            if (product) {
                product.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart(); // Cập nhật hiển thị
            }
        }

        if (event.target.classList.contains("decrease-qty")) {
            const product = cart.find((item) => item.slug === slug);
            if (product && product.quantity > 1) {
                product.quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart(); // Cập nhật hiển thị
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemIndex = parseInt(event.target.getAttribute("data-index"));
            cart.splice(itemIndex, 1); // Xóa sản phẩm khỏi mảng
            localStorage.setItem("cart", JSON.stringify(cart)); // Lưu lại giỏ hàng vào localStorage
            updateCart(); // Cập nhật hiển thị
        }
    });

    // Khởi tạo hiển thị giỏ hàng
    updateCart();
});
