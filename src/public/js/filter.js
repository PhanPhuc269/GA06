function filterProducts(filter) {
    fetch(`/product/filter?function=${filter}`)
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear existing products

            // Add filtered products
            data.products.forEach(product => {
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
        })
        .catch(error => console.error('Error:', error));
}