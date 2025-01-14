
let filters = {};

// Lấy giá trị ban đầu từ URL
const urlParams = new URLSearchParams(window.location.search);
filters.keyword = urlParams.get('keyword') || '';
filters.type = urlParams.get('type') || '';
filters.brand = urlParams.get('brand') ? urlParams.get('brand').split(',') : [];
filters.color = urlParams.get('color') ? urlParams.get('color').split(',') : [];
filters.minPrice = urlParams.get('minPrice') || '';
filters.maxPrice = urlParams.get('maxPrice') || '';
filters.sort = urlParams.get('sort') || 'default';
filters.page = parseInt(urlParams.get('page')) || 1;
filters.limit = parseInt(urlParams.get('limit')) || 12;

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');    
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    const searchInput = document.getElementById('search_input');

    if (keyword && searchInput) {
        searchInput.value = keyword;
        filters.keyword = keyword;
    }

    if (filters.type) {
        // Tìm danh mục con tương ứng với giá trị type
        const subcategoryItem = document.querySelector(`[data-type="${filters.type}"]`);

        if (subcategoryItem) {
            // Tô màu danh mục con
            subcategoryItem.classList.add('active');
            const collapseElement = subcategoryItem.closest('ul.collapse');
            if (collapseElement) {
                collapseElement.classList.add('show'); // Bootstrap class để mở danh mục
            }
        }
    }
    const typeInput = document.querySelector(`input[name="type"][value="${filters.type}"]`);
    if (typeInput) typeInput.checked = true;

    document.querySelectorAll('input[name="brand"]').forEach(input => {
        input.checked = filters.brand.includes(input.value);
    });

    const colorInput = document.querySelectorAll('input[name="color"]');
    colorInput.forEach(input => {
        input.checked = filters.color.includes(input.value);
    });

    const minPriceElement = document.getElementById('lower-value');
    const maxPriceElement = document.getElementById('upper-value');
    if (minPriceElement) minPriceElement.value = filters.minPrice;
    if (maxPriceElement) maxPriceElement.value = filters.maxPrice;

    const sortSelect = document.getElementById('sort-criteria');
    if (sortSelect) sortSelect.value = filters.sort;
    // Lắng nghe sự kiện submit của form
    searchForm.addEventListener('submit', function(event) {
        const currentUrl = window.location.pathname;
        if (currentUrl.includes('/product/search')) {
            event.preventDefault(); // Ngăn chặn hành vi submit mặc định
            // Lấy giá trị từ ô input
            var keyword = searchInput.value.trim();
            
            // Cập nhật giá trị keyword trong filters
            filters.keyword = keyword;
            filters.page = 1;
            applyFilters();

            // Gửi yêu cầu AJAX nếu đang ở trang tìm kiếm
            fetch(`/product/search?keyword=${encodeURIComponent(filters.keyword)}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                console.log('Response received:', response);
                return response.json();
            })
            .then(data => {
                // Xử lý dữ liệu trả về từ server
                console.log(data);
                // Cập nhật giao diện với dữ liệu mới
                // Ví dụ: cập nhật danh sách sản phẩm
                updateProductList(data.products);
            })
            .catch(error => console.error('Error:', error));
        }
        
    });
});
function setTypeFilter(type) {
    filters.type = type;
    filters.page = 1;
    applyFilters();
    setActiveCategory(type);
}

function setActiveCategory(type) {
    const categoryLinks = document.querySelectorAll('.main-nav-list.child a');
    categoryLinks.forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.getElementById(`${type}-link`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function filterProducts(filters) {
    const query = new URLSearchParams(filters).toString();
    history.pushState(null, '', `?${query}`);

    fetch(`/product/search?${query}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            updateProductList(data.products);
            updatePagination(data.currentPage, data.totalPages);
        })
        .catch(error => console.error('Error:', error));
}

function updatePagination(currentPage, totalPages) {
    const paginationContainers = document.querySelectorAll('.pagination');
    paginationContainers.forEach(paginationContainer => {
        paginationContainer.innerHTML = '';

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
    applyFilters();
}
// document.addEventListener("DOMContentLoaded", () => {

//     // Lắng nghe sự kiện click thông qua event delegation
//     document.addEventListener("click", (event) => {
//         // Kiểm tra nếu nút bấm có class "add-to-cart"
//         const button = event.target.closest(".add-to-cart");
//         if (!button) return;

//         event.preventDefault();

//         // Lấy thông tin sản phẩm từ các thuộc tính data
//         const productSlug = button.getAttribute("data-slug");
//         const productName = button.getAttribute("data-name");
//         const productPrice = parseFloat(button.getAttribute("data-price"));
//         const productImage = button.getAttribute("data-image");

//         // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
//         const existingProduct = cart.find((item) => item.slug === productSlug);

//         if (existingProduct) {
//             // Nếu tồn tại, tăng số lượng
//             existingProduct.quantity += 1;
//         } else {
//             // Nếu chưa tồn tại, thêm sản phẩm mới
//             cart.push({
//                 slug: productSlug,
//                 name: productName,
//                 price: productPrice,
//                 image: productImage,
//                 quantity: 1,
//             });
//         }

//         // Lưu lại giỏ hàng vào localStorage
//         localStorage.setItem("cart", JSON.stringify(cart));

//         //alert(`${productName} đã được thêm vào giỏ hàng!`);
//         showToast(`${productName} đã được thêm vào giỏ hàng!`, 'success', 'Success');
        
//         gtag('event', 'add_to_cart', {
//             'currency': 'VND', // Hoặc USD nếu cần
//             'value': productPrice , // Tổng giá trị của sản phẩm trong giỏ
//             'items': [{
//                 'item_name': productName,  // Tên sản phẩm
//                 'item_id': productSlug,    // ID sản phẩm
//                 // 'quantity': quantity,      // Số lượng
//                 'price': productPrice      // Giá sản phẩm
//             }]
//         });
//     });
// });

function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Xóa danh sách sản phẩm cũ

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('col-lg-4', 'col-md-6');
        productItem.innerHTML = `
            <div class="single-product">
                <a href="/product/product-details/${product.slug}">
                    <img class="img-fluid" src="${product.images[0]}" alt="${product.name}">
                </a>
                <div class="product-details">
                    <a href="/product/product-details/${product.slug}">
                        <h6>${product.name}</h6>
                    </a>
                    <div class="price">
                        <h6>VND ${product.salePrice}</h6>
                          <h6 class="l-through">VND ${product.originalPrice}</h6>
                    </div>
                    <div class="prd-bottom">
                        <a href="#" class="social-info add-to-cart" data-slug="${product.slug}" data-name="${product.name}" data-price="${product.salePrice}" data-image="${product.image}">
                            <span class="ti-bag"></span>
                        </a>
                        <a href="#" class="social-info">
                            <span class="lnr lnr-heart"></span>
                            <p class="hover-text">Wishlist</p>
                        </a>
                        <a href="#" class="social-info">
                            <span class="lnr lnr-sync"></span>
                            <p class="hover-text">compare</p>
                        </a>
                        <a href="/product/product-details/${product.slug}" class="social-info">
                            <span class="lnr lnr-move"></span>
                            <p class="hover-text">view more</p>
                        </a>
                    </div>
                </div>
            </div>
        `;

        productList.appendChild(productItem);
    });

    // // Lắng nghe sự kiện "add-to-cart" cho các sản phẩm mới
    // document.querySelectorAll(".add-to-cart").forEach((button) => {
    //     button.addEventListener("click", (event) => {
    //         event.preventDefault();

    //         // Lấy thông tin sản phẩm từ các thuộc tính data
    //         const productSlug = button.getAttribute("data-slug");
    //         const productName = button.getAttribute("data-name");
    //         const productPrice = parseFloat(button.getAttribute("data-price"));
    //         const productImage = button.getAttribute("data-image");

    //         // Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
    //         const cart = JSON.parse(localStorage.getItem("cart")) || [];

    //         // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
    //         const existingProduct = cart.find((item) => item.slug === productSlug);

    //         if (existingProduct) {
    //             // Nếu sản phẩm đã tồn tại, tăng số lượng
    //             existingProduct.quantity += 1;
    //         } else {
    //             // Nếu chưa có sản phẩm, tạo mới và thêm vào giỏ hàng
    //             cart.push({
    //                 slug: productSlug, // Dùng slug thay vì id
    //                 name: productName,
    //                 price: productPrice,
    //                 image: productImage,
    //                 quantity: 1,
    //             });
    //         }

    //         // Lưu lại giỏ hàng vào localStorage
    //         localStorage.setItem("cart", JSON.stringify(cart));

    //         // Cập nhật lại giao diện giỏ hàng
    //         //alert(`${productName} đã được thêm vào giỏ hàng!`);
    //         showToast(`${productName} đã được thêm vào giỏ hàng!`, 'success', 'Success');
    //     });
    // });
}

function updateItemsPerPage(limit) {
    filters.limit = parseInt(limit);
    filters.page = 1;

        
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
    const niceSelectCurrentBottom = selectBottom.nextElementSibling.querySelector('.current');
    if (niceSelectCurrentBottom) {
        niceSelectCurrentBottom.textContent = `Show ${limit}`;
    }
    
    applyFilters();
}

function applySort(sort) {
    filters.sort = sort;
    filters.page = 1;
    applyFilters();
}

function applyFilters() {
    filters.brand = getCheckedValues('brand');
    filters.color = getCheckedValues('color');

    const minPrice = document.getElementById('lower-value')?.textContent;
    const maxPrice = document.getElementById('upper-value')?.textContent;

    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;

    const query = new URLSearchParams(filters).toString();
    history.pushState(null, '', `?${query}`);

    filterProducts(filters);
}

document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.querySelector('#sort-criteria');
    if (sortSelect) {
        sortSelect.value = filters.sort;
        sortSelect.addEventListener('change', () => applySort(sortSelect.value));
    }

    const selectLimitTop = document.querySelector('#items-per-page');
    const selectLimitBottom = document.querySelector('#items-per-page-bottom');

    selectLimitTop.value = filters.limit;
    selectLimitBottom.value = filters.limit;

    selectLimitTop.addEventListener('change', (e) => updateItemsPerPage(e.target.value));
    selectLimitBottom.addEventListener('change', (e) => updateItemsPerPage(e.target.value));

    document.querySelectorAll('input[name="type"], input[name="brand"], input[name="color"]').forEach(input => {
        input.addEventListener('change', () => { 
            filters.page = 1;
            applyFilters();
        });
    });
    
});
