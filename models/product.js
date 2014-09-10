var mongodb = require('./db');

function Product(product) {
    this.barcode=product.barcode;
    this.name=product.name;
    this.unit=product.unit;
    this.price=product.price;
}

module.exports= Product;

Product.prototype.save= function (callback) {
    var product={
        barcode:this.barcode,
        name:this.name,
        unit:this.unit,
        price:this.price
    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('products', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(product,{safe:true}, function (err,product) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,product[0]);
            })
        })
    })
}
Product.get= function (name,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('products', function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        })
    })
}

