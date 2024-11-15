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

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rePassword = document.getElementById('re-password').value;
    const errorMessage = document.getElementById('error-message');

    if (password !== rePassword) {
        errorMessage.textContent = 'Passwords do not match';
        return;
    }

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();

    if (response.status === 400) {
        errorMessage.textContent = result.message;
    } else if (response.status === 201) {
        window.location.href = '/login'; // Redirect to success page
    } else {
        errorMessage.textContent = 'An unexpected error occurred';
    }
}