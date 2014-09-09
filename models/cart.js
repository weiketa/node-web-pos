function Cart() {

}

module.exports=Cart;
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

Cart.count_cart_products_number= function (cart_products){
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
};

Cart.get_cart_products_bill= function (products_number,products) {
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
};

Cart.get_cart_products_price_bill= function (bill){
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
};

Cart.get_total_price= function (cart_bill_detail) {
    var total_price=0;
    var promotion_price=0;
    for(key in cart_bill_detail){
        total_price +=cart_bill_detail[key].totalPrice;
        if(cart_bill_detail[key].isPromtional){
            promotion_price+=cart_bill_detail[key].promotionNumber*cart_bill_detail[key].price;
        }
    }
    return total_price-promotion_price;
};

Cart.get_promotion_price=function(cart_bill_detail) {
    var promotion_price=0;
    for(key in cart_bill_detail){
        if(cart_bill_detail[key].isPromtional){
            promotion_price+=cart_bill_detail[key].promotionNumber*cart_bill_detail[key].price;
        }
    }
    return promotion_price;
};