document.getElementById("searchForm").addEventListener("submit", (event) => {
    const searchInput = document.getElementById("search_input").value.trim();

    if (searchInput) {
        // Lấy danh sách lịch sử tìm kiếm từ localStorage
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

        // Loại bỏ từ khóa nếu đã tồn tại, sau đó thêm vào đầu danh sách
        searchHistory = searchHistory.filter((keyword) => keyword !== searchInput);
        searchHistory.unshift(searchInput);

        // Giới hạn lịch sử tìm kiếm (ví dụ: chỉ lưu 10 từ khóa gần nhất)
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }

        // Lưu lại danh sách vào localStorage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
});

const searchInput = document.getElementById("search_input");
const searchHistoryContainer = document.getElementById("search-history-container");

// Hiển thị lịch sử tìm kiếm
searchInput.addEventListener("focus", () => {
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (searchHistory.length > 0) {
        searchHistoryContainer.innerHTML = `
            <ul>
                ${searchHistory.map((keyword) => `<li>${keyword}</li>`).join("")}
            </ul>
        `;
        searchHistoryContainer.style.display = "block";
    }
});

// Ẩn lịch sử khi click ra ngoài
document.addEventListener("click", (event) => {
    if (!searchHistoryContainer.contains(event.target) && event.target !== searchInput) {
        searchHistoryContainer.style.display = "none";
    }
});

// Điền từ khóa vào ô tìm kiếm khi chọn lịch sử
searchHistoryContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        searchInput.value = event.target.textContent.trim();
        searchHistoryContainer.style.display = "none";
    }
});
