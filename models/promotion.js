function Promotion() {

}

module.exports=Promotion;

Promotion.isPromotional= function (barcode,barcodes) {
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
    promotionalGood.isPromotional=true;
    if(promotionalGood.number>=3){
        promotionalGood.showPrice=promotionalGood.promotionPrice+'元'+'(原价：'+promotionalGood.totalPrice+'元)';
        return;
    }
    promotionalGood.showPrice=promotionalGood.totalPrice+'元';
};

Promotion.countNormalGood=function (normalGood) {
    normalGood.totalPrice=normalGood.number*normalGood.price;
    normalGood.showPrice=normalGood.totalPrice+'元';
    normalGood.isPromotional=false;
};



