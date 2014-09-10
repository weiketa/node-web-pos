function Cart() {

}

module.exports=Cart;
var Promotion=require('./promotion');
var _=require('underscore');

Cart.sort_cart= function (cart) {
    for(var i=0;i<cart.length-1;i++){
        for(var j=i+1;j<cart.length;j++){
            if(cart[i][9]>cart[j][9]){
                var middle=cart[j];
                cart[j]=cart[i];
                cart[i]=middle;
            }
        }
    }
};

Cart.get_cart_products_bill= function (cart_products,products) {
    var cart_products_bill=[];
    var products_number=_.countBy(cart_products);
    _.each(products_number, function (value,key) {
        _.each(products, function (element,index) {
            if(key==products[index].barcode){
                products[index].number=products_number[key];
                cart_products_bill.push(products[index]);
            }
        })
    });
    return cart_products_bill;
};

Cart.get_cart_products_price_bill= function (bill){
    var promotionalGoods=[
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
    ];
    _.each(bill, function (element) {
        if(Promotion.isPromotional(element.barcode,promotionalGoods)){
            Promotion.countPromotionalGood(element);
        }else{
            Promotion.countNormalGood(element);
        }
    });
    return bill;
};

Cart.get_total_price= function (cart_bill_detail) {
    var total_price=0;
    var promotion_price=0;
    _.each(cart_bill_detail, function (element) {
        total_price +=element.totalPrice;
        if(element.isPromotional){
            promotion_price+=element.promotionNumber*element.price;
        }
    })
    return total_price-promotion_price;
};

Cart.get_promotion_price=function(cart_bill_detail) {
    var promotion_price=0;
    _.each(cart_bill_detail, function (element) {
        if(element.isPromotional){
            promotion_price+=element.promotionNumber*element.price;
        }
    })
    return promotion_price;
};

Cart.get_update_product_info=function (barcode,cart_bill_detail) {
    for(var i=0;i<cart_bill_detail.length;i++){
        if(barcode==cart_bill_detail[i].barcode){
            return cart_bill_detail[i];
        }
    }
    return {showPrice:0+'元'}
};