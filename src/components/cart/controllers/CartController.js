class CartController{
    ViewShoppingCart(req, res, next) {
        res.render('cart');
    } 
}

module.exports = new CartController();