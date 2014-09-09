
/*
 * GET home page.
 */


 var Product=require('../models/product.js');
 var Cart=require('../models/cart.js');
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
         var cart_bill=get_cart_products_bill(count_cart_products_number(req.session.cart),products);
            var cart_bill_detail=get_cart_products_price_bill(cart_bill);
            res.render('cart',{cart_count:req.session.cart.length,cart_bill:cart_bill_detail,total_price:get_total_price(cart_bill_detail)});
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
            var cart_bill=get_cart_products_bill(count_cart_products_number(req.session.cart),products);
            var cart_bill_detail=get_cart_products_price_bill(cart_bill);
            var product_update_price=get_update_product_info(req.params.barcode,cart_bill_detail).showPrice;
            res.send({cart_count:req.session.cart.length,update_price:product_update_price,total_price:get_total_price(cart_bill_detail)});
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
            var cart_bill=get_cart_products_bill(count_cart_products_number(req.session.cart),products);
            var cart_bill_detail=get_cart_products_price_bill(cart_bill);
            var product_update_price=get_update_product_info(req.params.barcode,cart_bill_detail).showPrice;
            res.send({cart_count:req.session.cart.length,update_price:product_update_price,total_price:get_total_price(cart_bill_detail)});
        });
    });
    app.get('/shopping_list', function (req,res) {
        Cart.sort_cart(req.session.cart);
        Product.get(null, function (err,products) {
            if(err){
                products=[];
            }
            var cart_bill=get_cart_products_bill(count_cart_products_number(req.session.cart),products);
            var cart_bill_detail=get_cart_products_price_bill(cart_bill);
            res.render('shopping_list',{cart_count:req.session.cart.length,cart_bill:cart_bill_detail,total_price:get_total_price(cart_bill_detail),promotion_price:get_promotion_price(cart_bill_detail),time_now:get_time_now()});
        });
    });
    app.get('/clear_cart', function (req,res) {
        req.session.cart=[];
        res.redirect('product_list');
    })
}

function count_cart_products_number(cart_products) {
    var products_number={};
    for(var i=0;i<cart_products.length;i++){
        if(!(cart_products[i] in products_number)){
            products_number[cart_products[i]]=0;
            for(var j=0;j<cart_products.length;j++){
                if(cart_products[i]==cart_products[j]){
                    products_number[cart_products[i]]++;
                }
            }
        }
    }
    return products_number;
}

function get_cart_products_bill(products_number,products) {
    var cart_products_bill=[];
    for(var key in products_number){
        for(var i=0;i<products.length;i++){
            if(key==products[i].barcode){
                products[i].number=products_number[key];
                cart_products_bill.push(products[i]);
            }
        }
    }
    return cart_products_bill;
}
function get_cart_products_price_bill (bill) {
    var promotionalGoods=[
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
    ];
    for(var i=0;i<bill.length;i++){
        if(isPromotional(bill[i].barcode,promotionalGoods)){
            countPromotionalGood(bill[i]);
        }
        else{
            countNormalGood(bill[i]);
        }
    }
    return bill;
}
function isPromotional(barcode,barcodes) {
    for(var i in barcodes){
        if(barcode==barcodes[i]){
            return true;
        }
    }
    return false;
}
function countPromotionalGood(promotionalGood) {
    promotionalGood.promotionNumber=parseInt(promotionalGood.number/3);
    promotionalGood.totalPrice=promotionalGood.number*promotionalGood.price;
    promotionalGood.promotionPrice=promotionalGood.totalPrice-promotionalGood.promotionNumber*promotionalGood.price;
    promotionalGood.isPromtional=true;
    if(promotionalGood.number>=3){
        promotionalGood.showPrice=promotionalGood.promotionPrice+'元'+'(原价：'+promotionalGood.totalPrice+'元)';
        return;
    }
    promotionalGood.showPrice=promotionalGood.totalPrice+'元';
}
function countNormalGood(normalGood) {
    normalGood.totalPrice=normalGood.number*normalGood.price;
    normalGood.showPrice=normalGood.totalPrice+'元';
    normalGood.isPromtional=false;
}
function get_update_product_info(barcode,cart_bill_detail) {
    for(var i=0;i<cart_bill_detail.length;i++){
        if(barcode==cart_bill_detail[i].barcode){
            return cart_bill_detail[i];
        }
    }
    return {showPrice:0+'元'}
}
function get_total_price(cart_bill_detail) {
    var total_price=0;
    var promotion_price=0;
    for(key in cart_bill_detail){
            total_price +=cart_bill_detail[key].totalPrice;
        if(cart_bill_detail[key].isPromtional){
            promotion_price+=cart_bill_detail[key].promotionNumber*cart_bill_detail[key].price;
        }
    }
    return total_price-promotion_price;
}
function get_promotion_price(cart_bill_detail) {
    var promotion_price=0;
    for(key in cart_bill_detail){
        if(cart_bill_detail[key].isPromtional){
            promotion_price+=cart_bill_detail[key].promotionNumber*cart_bill_detail[key].price;
        }
    }
    return promotion_price;
}

function get_time_now(){
    var time_now=new Date();
    var day=time_now.getDate();
    var month=time_now.getMonth()+1;
    var year=time_now.getFullYear();
    var time=time_now.toString().substr(16,8);
    return year+'年'+month+'月'+day+'日'+time;
};

