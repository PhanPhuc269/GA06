async function syncCartWithServer() {
    const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
       
//console.log(localCart);
    try {
     
        const response = await fetch('/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: localCart }), // Gửi dưới dạng { items: [] }
        });
    


        if (response.ok) {
            // const data = await response.json();
          //  console.log('Giỏ hàng đồng bộ thành công:', localCart);
        } else {
            console.error('Lỗi khi đồng bộ giỏ hàng');
        }
    } catch (error) {
        console.error('Lỗi kết nối đến server:', error);
    }
}

// Gọi hàm đồng bộ khi đăng nhập thành công
syncCartWithServer();




