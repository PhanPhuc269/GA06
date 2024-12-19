document.getElementById('btn-pay').addEventListener('click', async () => {
    //  const transactionId = '{{transactionId}}'; // Truyền transactionId từ backend
     const transactionId = event.target.getAttribute('data-transaction-id');
     console.log('idgd:',transactionId);
      const countdownElement = document.getElementById('countdown-timer');
      const statusElement = document.getElementById('payment-status');
      const qrCodeImg = document.getElementById('qr-code-img');

      // Ẩn nút và hiển thị mã QR to hơn
      document.getElementById('btn-pay').style.display = 'none';
      qrCodeImg.style.maxWidth = '500px';
      countdownElement.style.display = 'block';

      // Thiết lập thời gian đếm ngược
      let timeLeft = 5 * 60; // 5 phút
      const timer = setInterval(() => {
          if (timeLeft <= 0) {
              clearInterval(timer);
              statusElement.innerHTML = "<span class='text-danger'>Transaction failed. Please try again!</span>";
              statusElement.style.display = 'block';
              return;
          }
          timeLeft--;

          // Hiển thị thời gian còn lại
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          document.getElementById('time-left').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);

      // Gửi yêu cầu POST để bắt đầu thanh toán
      try {
          console.log('lỗi gì nè ba ơi\n\nloofn')
          const response = await fetch('/transaction/processPayment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transactionId }),
          });
          const result = await response.json();
          console.log('mess: ',result.message);
if (result.message === 'Transaction completed successfully') {
          if (result.transaction.status === 'completed') {
              clearInterval(timer);
              statusElement.innerHTML = "<span class='text-success'>Payment successful! Redirecting...</span>";
              statusElement.style.display = 'block';

              // Chuyển hướng sau 2 giây
              setTimeout(() => {
                  window.location.href = '/order/list';
              }, 2000);
          }
}
      } catch (error) {
          clearInterval(timer);
          statusElement.innerHTML = "<span class='text-danger'>An error occurred during payment. Please try again!</span>";
          statusElement.style.display = 'block';
      }
  });