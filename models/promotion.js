function Promotion() {

}

Promotion.isPromtional= function (barcode,barcodes) {
    for(var i in barcodes){
        if(barcode==barcodes[i]){
            return true;
        }
    }
    return false;
};

Promotion.countPromotionalGood= function (promotionalGood){
    promotionalGood.promotionNumber=parseInt(promotionalGood.number/3);
    promotionalGood.totalPrice=promotionalGood.number*promotionalGood.price;
    promotionalGood.promotionPrice=promotionalGood.totalPrice-promotionalGood.promotionNumber*promotionalGood.price;
    promotionalGood.isPromtional=true;
    if(promotionalGood.number>=3){
        promotionalGood.showPrice=promotionalGood.promotionPrice+'元'+'(原价：'+promotionalGood.totalPrice+'元)';
        return;
    }
    promotionalGood.showPrice=promotionalGood.totalPrice+'元';
};

Promotion.countNormalGood=function (normalGood) {
    normalGood.totalPrice=normalGood.number*normalGood.price;
    normalGood.showPrice=normalGood.totalPrice+'元';
    normalGood.isPromtional=false;
};

Promotion.get_update_product_info=function (barcode,cart_bill_detail) {
    for(var i=0;i<cart_bill_detail.length;i++){
        if(barcode==cart_bill_detail[i].barcode){
            return cart_bill_detail[i];
        }
    }
    return {showPrice:0+'元'}
};

