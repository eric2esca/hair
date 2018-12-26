var express = require("express");
var keys = require("./keys");
var stripe = require("stripe")(keys.stripeKeys.stripeSecretKey);
var bodyParser = require("body-parser");
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/paysuccess', function (req, res) {
    res.sendFile(path.join(__dirname + '/paysuccess.html'));
});

app.post("/charge", function(req, res) {
    var token = req.body.stripeToken;

    const charge = stripe.charges.create({
        amount: 2000,
        currency: 'usd',
        description: 'Haircut Charge',
        source: token,
    }, function(err, charge){
        if(err  === "StripeCardError"){
            console.log("Your card was declined");
        }
    });
    console.log("payment was successful");
    res.redirect('/paysuccess');
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("stripe is running");
});