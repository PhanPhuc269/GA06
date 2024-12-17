

// let cartUpdateQueue = []; // Queue lưu thay đổi giỏ hàng

// // Thêm thay đổi vào queue
// function addToCartQueue(productId, quantity, price) {
//     const existingIndex = cartUpdateQueue.findIndex((item) => item.productId === productId);

//     if (existingIndex > -1) {
//         // Cập nhật nếu đã có trong queue
//         cartUpdateQueue[existingIndex] = { productId, quantity, price };
//     } else {
//         // Thêm mới nếu chưa có
//         cartUpdateQueue.push({ productId, quantity, price });
//     }
// }

// // Gửi batch lên server định kỳ
// async function processCartUpdates() {
//     console.log("update")
//     console.log(cartUpdateQueue);
//     if (cartUpdateQueue.length === 0) return;
   
//     console.log(cartUpdateQueue);
//     const updatesToSend = [...cartUpdateQueue];
//     cartUpdateQueue = []; // Xóa queue sau khi gửi

//     try {
//         const response = await fetch('/cart/update-batch', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
               
//             },
//             body: JSON.stringify({ updates: updatesToSend }),
//         });

//         if (response.ok) {
//             console.log('Batch cập nhật giỏ hàng thành công!');
//         } else {
//             console.error('Lỗi khi batch cập nhật');
//             cartUpdateQueue = updatesToSend.concat(cartUpdateQueue); // Đẩy lại vào queue nếu lỗi
//         }
//         console.log(cartUpdateQueue);
//     } catch (error) {
//         console.error('Lỗi kết nối server:', error);
//         cartUpdateQueue = updatesToSend.concat(cartUpdateQueue);
//     }
// }

// // Gửi batch mỗi 1 giây
// setInterval(processCartUpdates, 1000);

// // Thêm sự kiện vào UI
// document.querySelectorAll('.quantity-input').forEach((input) => {
//     input.addEventListener('change', (e) => {
//         const productId = e.target.dataset.productId;
//         const quantity = parseInt(e.target.value, 10);
//         const price = parseFloat(e.target.dataset.price);

//         addToCartQueue(productId, quantity, price);
//     });
// });
