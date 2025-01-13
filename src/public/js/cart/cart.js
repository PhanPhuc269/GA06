document.addEventListener("DOMContentLoaded", () => {

    console.log('cc: ',localStorage.getItem("cart"))
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
   
    // Hàm cập nhật giao diện giỏ hàng
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalPrice = 0;
        let totalQuantity = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Your cart is empty!</td>
                </tr>`;
            updateTotalPrice(0);
            updateCartCount(0);
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            totalQuantity += item.quantity;

            const row = `
                <tr>
                    <td>
                        <div class="media">
                            <a href="/product/product-details/${item.slug}">
                                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;" class="img-fluid mr-3">
                            </a>
                            <div class="media-body">
                                <a href="/product/product-details/${item.slug}">
                                    <p>${item.name}</p>
                                </a>
                                <small>Size: ${item.size} | Color: ${item.color}</small>
                            </div>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="decrease-qty btn btn-sm btn-outline-secondary" data-slug="${item.slug}" data-size="${item.size}" data-color="${item.color}">-</button>
                            <input type="text" value="${item.quantity}" class="qty-input text-center" readonly style="width: 40px;">
                            <button class="increase-qty btn btn-sm btn-outline-secondary" data-slug="${item.slug}" data-size="${item.size}" data-color="${item.color}">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                    </td>
                </tr>`;
            cartItemsContainer.insertAdjacentHTML("beforeend", row);
        });

        const totalRow = `
            <tr>
                <td colspan="4" class="text-right"><strong>Total Price:</strong></td>
                <td><h5 id="cart-total">$${totalPrice.toFixed(2)}</h5></td>
            </tr>`;
        cartItemsContainer.insertAdjacentHTML("beforeend", totalRow);

        updateTotalPrice(totalPrice);
        updateCartCount(totalQuantity);
    }

    function updateCartCount(count) {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) cartCountElement.innerText = count;
    }

    function updateTotalPrice(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) totalElement.innerText = `$${total.toFixed(2)}`;
    }

    cartItemsContainer.addEventListener("click", (event) => {
        const slug = event.target.getAttribute("data-slug");
        const size = event.target.getAttribute("data-size");
        const color = event.target.getAttribute("data-color");

        if (event.target.classList.contains("increase-qty")) {
            const product = cart.find((item) => item.slug === slug && item.size === size && item.color === color);
            if (product) {
                product.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            }
        }

        if (event.target.classList.contains("decrease-qty")) {
            const product = cart.find((item) => item.slug === slug && item.size === size && item.color === color);
            if (product && product.quantity > 1) {
                product.quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemIndex = parseInt(event.target.getAttribute("data-index"));
            cart.splice(itemIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    // Khởi tạo hiển thị
    updateCart();
});
