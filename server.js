var express = require('express');
var app = express();
// set up Mongo
var mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useUnifiedTopology: true, useNewUrlParser: true };
///////////////////bodyParser/////////////////////////
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////////////////
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render('pages/home');
});

app.get("/products", function (req, res) {
    // get data from MongoDB
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");
        var query = {}
        dbo.collection("cars")
            .find(query)
            // .sort(sort)
            .toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/products', { car: result });
                db.close();
            });
    });
});

app.get("/detail/:id", function (req, res) {
    var classid = req.params.id;
    // get a class detail from mongoDB
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");
        var query = { car_no: classid }
        dbo.collection("cars")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/detail', { detail: result });
                db.close();
            });
    });
});

// add ///////////////////////////////////////////////////////////////
app.get("/add", function (req, res) {
    res.render('pages/add');
});

app.post("/addsave", function (req, res) {
    var no = req.body.no;
    var name = req.body.name;
    var brand = req.body.brand;
    var price = req.body.price;

    console.log(no, name, brand, price);

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");
        /////////Select target///////////////
        /////////Set new value///////////////
        var newvalues = {
            car_no: no,
            car_name: name,
            car_brand: brand,
            car_price: price
        };
        dbo.collection("cars").insertOne(newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.redirect("/products");
});


// edit ///////////////////////////////////////////////////////////////
app.get("/edit/:id", function (req, res) {
    var classid = req.params.id;
    // get a class detail from mongoDB
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");
        var query = { car_no: classid }
        dbo.collection("cars")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/edit', { edit: result });
                db.close();
            });
    });
});

app.post("/editsave", function (req, res) {
    var no = req.body.noo;
    var name = req.body.name;
    var brand = req.body.brand;
    var price = req.body.price;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");
        /////////Select target///////////////
        var myquery = { car_no: no };
        /////////Set new value///////////////
        var newvalues = {
            $set: {
                car_name: name,
                car_brand: brand,
                car_price: price
            }
        };
        dbo.collection("cars").updateOne(myquery, newvalues, function (err, res) {
            //////////or updateOne or updateMany
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated");
            db.close();
        });
    });
    res.redirect("/products");
});

// delete ///////////////////////////////////////////////////////////////
app.get("/delete/:id", function (req, res) {
    var classid = req.params.id;
    // get a class detail from mongoDB
    MongoClient.connect(url, options, function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cars_Product");

        // select target
        var query = {
            car_no: classid
        }

        dbo.collection("cars")
            .deleteOne(query, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
    });
    res.redirect("/products");
});

app.listen(9874);