document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');

    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    // Khi click vào tên tệp, mở lại trình chọn tệp
    fileNameDisplay.addEventListener('click', function () {
        fileInput.click();
    });
});
document.getElementById('resend-confirmation-button').addEventListener('click', function() {
    document.getElementById('resend-email-form').submit();
  });
