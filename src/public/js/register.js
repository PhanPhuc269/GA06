document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rePassword = document.getElementById('re-password').value;
            const errorMessage = document.getElementById('error-message');

            if (!username || !email || !password || !rePassword) {
                event.preventDefault(); // Ngăn chặn form gửi đi
                errorMessage.textContent = 'All fields are required!';
            } else if (password !== rePassword) {
                event.preventDefault(); // Ngăn chặn form gửi đi
                errorMessage.textContent = 'Passwords do not match!';
            } else {
                errorMessage.textContent = ''; // Xóa thông báo lỗi nếu tất cả các trường đều hợp lệ
            }
        });
    }
});