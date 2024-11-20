document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search); // Lấy tham số từ URL
    const keyword = urlParams.get('keyword'); // Lấy giá trị của tham số 'keyword'
    const searchInput = document.getElementById('search_input'); // Tìm trường input của ô tìm kiếm

    if (keyword && searchInput) {
        searchInput.value = keyword; // Gán giá trị từ URL vào trường input
    }
});
let filters = {};

// Kiểm tra xem URL có trường keyword hay không
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('keyword');

if (keyword) {
    filters.keyword = keyword;
}

function setTypeFilter(type) {
    filters.type = type; // Gán type mới
    filters.page = 1; // Reset về trang đầu tiên khi thay đổi loại
    applyFilters(); // Áp dụng tất cả bộ lọc
    setActiveCategory(type);
}
function setActiveCategory(type) {
    
    // Xóa class 'active' từ tất cả danh mục
    const categoryLinks = document.querySelectorAll('.main-nav-list.child a');
    categoryLinks.forEach(link => {
        if (link.classList.contains('active')) {
            link.classList.remove('active');
        }
    });
    // Thêm class 'active' vào danh mục được chọn
    const activeLink = document.getElementById(`${type}-link`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function applyFilters() {
    // Kiểm tra xem URL có trường keyword hay không
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');

    if (keyword) {
        filters.keyword = keyword;
    }
    
    // Thu thập giá trị cho từng loại lọc
    filters.brand = getCheckedValues('brand');
    filters.color = getCheckedValues('color');
    
    const minPrice = document.getElementById('lower-value')?.textContent;
    const maxPrice = document.getElementById('upper-value')?.textContent;

    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;

    // Gọi API lọc
    filterProducts(filters);
}

// Hàm lấy tất cả giá trị được chọn
function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Hàm gửi request với tất cả các bộ lọc
function filterProducts(filters) {
    const query = new URLSearchParams(filters).toString();
    //history.pushState(null, '', `?${query}`);
    fetch(`/product/filter?${query}`)
        .then(response => response.json())
        .then(data => {
            updateProductList(data.products);
            updatePagination(data.currentPage, data.totalPages);
        })
        .catch(error => console.error('Error:', error));
}
function updatePagination(currentPage, totalPages) {
    const paginationContainers = document.querySelectorAll('.pagination'); // Chọn cả hai pagination (trên & dưới)
    
    paginationContainers.forEach(paginationContainer => {
        paginationContainer.innerHTML = ''; // Xóa nội dung cũ

        if (currentPage > 1) {
            paginationContainer.innerHTML += `<a href="#" class="prev-arrow" onclick="changePage(${currentPage - 1})"><i class="fa fa-long-arrow-left" aria-hidden="true"></i></a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += `<a href="#" class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</a>`;
        }

        if (currentPage < totalPages) {
            paginationContainer.innerHTML += `<a href="#" class="next-arrow" onclick="changePage(${currentPage + 1})"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>`;
        }
    });
}

function changePage(page) {
    filters.page = page; 
    const query = new URLSearchParams(filters).toString();
    //history.pushState(null, '', `?${query}`);
    applyFilters(); 
}

// Hàm để cập nhật danh sách sản phẩm
function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Xóa các sản phẩm hiện có

    // Render sản phẩm được lọc
    products.forEach(product => {
        productList.innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="single-product">
                    <a href="/product/product-details/${product._id}">
                        <img class="img-fluid" src="/${product.image}" alt="${product.name}">
                    </a>
                    <div class="product-details">
                        <a href="/product/product-details/${product._id}">
                            <h6>${product.name}</h6>
                        </a>
                        <div class="price">
                            <h6>$${product.price}</h6>
                        </div>
                        <div class="prd-bottom">
                            <a href="" class="social-info">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to bag</p>
                            </a>
                            <a href="" class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>
                            <a href="" class="social-info">
                                <span class="lnr lnr-sync"></span>
                                <p class="hover-text">compare</p>
                            </a>
                            <a href="/product/product-details/${product._id}" class="social-info">
                                <span class="lnr lnr-move"></span>
                                <p class="hover-text">view more</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}
function updateItemsPerPage(limit) {
    filters.limit = parseInt(limit); // Cập nhật số lượng sản phẩm mỗi trang
    filters.page = 1; // Reset về trang đầu tiên khi thay đổi số lượng
    
    // Đồng bộ giá trị dropdown trên giao diện
    const selectTop = document.querySelector('#items-per-page');
    const selectBottom = document.querySelector('#items-per-page-bottom');

    selectTop.value = limit; 
    selectBottom.value = limit;

        // Cập nhật giao diện tùy chỉnh của nice-select
    const niceSelectCurrent = selectTop.nextElementSibling.querySelector('.current');
    if (niceSelectCurrent) {
        niceSelectCurrent.textContent = `Show ${limit}`;
    }
        // Cập nhật giao diện tùy chỉnh của nice-select
    niceSelectCurrentBottom = selectBottom.nextElementSibling.querySelector('.current');
    if (niceSelectCurrentBottom) {
        niceSelectCurrentBottom.textContent = `Show ${limit}`;
    }

    applyFilters(); // Gọi lại bộ lọc để tải dữ liệu mới
}
// Gắn sự kiện tự động gọi applyFilters khi có thay đổi
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    const selectLimitTop = document.querySelector('#items-per-page');
    const selectLimitBottom = document.querySelector('#items-per-page-bottom');

    // Thiết lập giá trị ban đầu cho cả hai dropdown
    selectLimitTop.value = filters.limit || 12;
    selectLimitBottom.value = filters.limit || 12;

    // Gắn sự kiện onchange cho cả hai
    selectLimitTop.addEventListener('change', (e) => updateItemsPerPage(e.target.value));
    selectLimitBottom.addEventListener('change', (e) => updateItemsPerPage(e.target.value));

    //updateItemsPerPage(document.getElementById('items-per-page').value);
    document.querySelectorAll('input[name="type"], input[name="brand"], input[name="color"]').forEach(input => {
        input.addEventListener('change',() => { 
            filters.page = 1;
            applyFilters(); 
        });
    });

});