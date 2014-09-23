
/*
 * GET home page.
 */


 var Product=require('../models/product.js');
 var Cart=require('../models/cart.js');
 var Time=require('../models/time.js');

module.exports = function (app) {
    app.get('/', function (req,res) {
        res.render('index',{cart_count:req.session.cart.length})
    });
    app.get('/product_list', function (req,res) {
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
            if(!req.session.cart){
                req.session.cart=[];
            }
            res.render('product_list',{products:products,cart_count:req.session.cart.length})
        })
    });
    app.get('/input_product', function (req,res) {
        res.render('input_product');
    });
    app.post('/input_product', function (req,res) {
        var new_product = new Product({
            barcode:req.body.barcode,
            name:req.body.name,
            unit:req.body.unit,
            price:req.body.price
        });
        new_product.save(function () {
            return res.redirect('/input_product') ;
        });
    });
    app.get('/cart', function (req,res) {
        Cart.sort_cart(req.session.cart);
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
         var cart_bill=Cart.get_cart_products_bill(req.session.cart,products);
            var cart_bill_detail=Cart.get_cart_products_price_bill(cart_bill);
            res.render('cart',{cart_count:req.session.cart.length,cart_bill:cart_bill_detail,total_price:Cart.get_total_price(cart_bill_detail)});
        });
    });

    app.get('/add_to_cart/:barcode', function (req,res) {
        if(!req.session.cart){
            req.session.cart=[];
        }
        req.session.cart.push(req.params.barcode);
        Cart.sort_cart(req.session.cart);
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
            var cart_bill=Cart.get_cart_products_bill(req.session.cart,products);
            var cart_bill_detail=Cart.get_cart_products_price_bill(cart_bill);
            var product_update_price=Cart.get_update_product_info(req.params.barcode,cart_bill_detail).showPrice;
            res.send({cart_count:req.session.cart.length,update_price:product_update_price,total_price:Cart.get_total_price(cart_bill_detail)});
        });

    });
    app.get('/sub_to_cart/:barcode', function (req,res) {
        if(!req.session.cart){
            req.session.cart=[];
        }
        for(var i=0;i<req.session.cart.length;i++){
            if(req.session.cart[i]==req.params.barcode){
                req.session.cart.splice(i,1);
                break;
            }
        }
        Cart.sort_cart(req.session.cart);
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
            var cart_bill=Cart.get_cart_products_bill(req.session.cart,products);
            var cart_bill_detail=Cart.get_cart_products_price_bill(cart_bill);
            var product_update_price=Cart.get_update_product_info(req.params.barcode,cart_bill_detail).showPrice;
            res.send({cart_count:req.session.cart.length,update_price:product_update_price,total_price:Cart.get_total_price(cart_bill_detail)});
        });
    });
    app.get('/shopping_list', function (req,res) {
        Cart.sort_cart(req.session.cart);
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
            var cart_bill=Cart.get_cart_products_bill(req.session.cart,products);
            var cart_bill_detail=Cart.get_cart_products_price_bill(cart_bill);
            res.render('shopping_list',{cart_count:req.session.cart.length,cart_bill:cart_bill_detail,total_price:Cart.get_total_price(cart_bill_detail),promotion_price:Cart.get_promotion_price(cart_bill_detail),time_now:Time.get_time_now()});
        });
    });
    app.get('/clear_cart', function (req,res) {
        req.session.cart=[];
        res.redirect('product_list');
    })
    ;
    app.get('/admin', function (req,res) {
        res.render('admin/product_manage')
    })
};



