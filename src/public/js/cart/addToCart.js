// Lắng nghe sự kiện "add-to-cart" cho các sản phẩm mới
document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        // Lấy thông tin sản phẩm từ các thuộc tính data
        const productSlug = button.getAttribute("data-slug");
        const productName = button.getAttribute("data-name");
        const productPrice = parseFloat(button.getAttribute("data-price"));
        const productImage = button.getAttribute("data-image");

        // Lấy giá trị số lượng từ input
        const quantityInput = document.getElementById("sst");
        const quantity = parseInt(quantityInput.value) || 1; // Mặc định là 1 nếu không hợp lệ

        // Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
        const existingProduct = cart.find((item) => item.slug === productSlug);

        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            existingProduct.quantity += quantity;
        } else {
            // Nếu chưa có sản phẩm, tạo mới và thêm vào giỏ hàng
            cart.push({
                slug: productSlug,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity,
            });
        }

        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Cập nhật lại giao diện giỏ hàng hoặc hiển thị thông báo
        alert(`${quantity} x ${productName} đã được thêm vào giỏ hàng!`);
    });
});
