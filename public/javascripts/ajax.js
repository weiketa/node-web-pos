function add_product_to_cart(barcode) {
    document.getElementById('cart_bill').onclick=function (e) {
        e.target.previousSibling.previousSibling.innerText++;
        $.get('/add_to_cart/'+barcode+'', function (data) {
            document.getElementById('cart_count').innerText='购物车('+data.cart_count+')';
            e.target.parentNode.parentNode.nextSibling.nextSibling.innerText=data.update_price;
            document.getElementById('total_price').innerText='总计：'+data.total_price+'元';
        });
    }
};

function substract_product_to_cart(barcode) {
    document.getElementById('cart_bill').onclick=function (e) {
        if(e.target.nextSibling.nextSibling.innerText>0){
            e.target.nextSibling.nextSibling.innerText--;
            $.get('/sub_to_cart/'+barcode+'', function (data) {
                if(data.cart_count==0){
                    window.location='/product_list';
                }
                document.getElementById('cart_count').innerText='购物车('+data.cart_count+')';
                e.target.parentNode.parentNode.nextSibling.nextSibling.innerText=data.update_price;
                document.getElementById('total_price').innerText='总计：'+data.total_price+'元';
            });

        }
    }
};

function add_goods_to_cart(barcode) {
    $.get('/add_to_cart/'+barcode+'', function (data) {
        document.getElementById('cart_count').innerText='购物车('+data.cart_count+')';
    });
};