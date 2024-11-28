document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    const searchInput = document.getElementById('search_input');

    if (keyword && searchInput) {
        searchInput.value = keyword;
        filters.keyword = keyword;
    }
});

let filters = {};

// Lấy giá trị ban đầu từ URL
const urlParams = new URLSearchParams(window.location.search);
filters.keyword = urlParams.get('keyword') || '';
filters.type = urlParams.get('type') || '';
filters.brand = urlParams.getAll('brand') || [];
filters.color = urlParams.getAll('color') || [];
filters.minPrice = urlParams.get('minPrice') || '';
filters.maxPrice = urlParams.get('maxPrice') || '';
filters.sort = urlParams.get('sort') || 'default';
filters.page = parseInt(urlParams.get('page')) || 1;
filters.limit = parseInt(urlParams.get('limit')) || 12;

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

    fetch(`/product/filter?${query}`)
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

function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

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
                            <a href="#" class="social-info">
                                <span class="ti-bag"></span>
                                <p class="hover-text">add to bag</p>
                            </a>
                            <a href="#" class="social-info">
                                <span class="lnr lnr-heart"></span>
                                <p class="hover-text">Wishlist</p>
                            </a>
                            <a href="#" class="social-info">
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
    filters.limit = parseInt(limit);
    filters.page = 1;
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
