/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var LiqPay = require('./data/LiqPayInf');
var crypto	= require('crypto');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var total = calculateTotal(order_info.orderList);

    var order = {
        version: 3,
        public_key: LiqPay.PUBLIC_KEY,
        action: 'pay',
        amount: total,
        currency:'UAH',
        description: toString(order_info,total),
        order_id: Math.random(),
        sandbox: 1
    };

    var data = new Buffer(JSON.stringify(order)).toString('base64');
    var signature = sha1(LiqPay.PRIVATE_KEY + data + LiqPay.PRIVATE_KEY);
    res.send({
        data:data,
        signature:signature
    });

    function sha1(string){
        var sha1 = crypto.createHash('sha1');
        sha1.update(string);
        return	sha1.digest('base64');
    }
};

function toString(order_info, total){
    return 'Замовлення піци: '+order_info.name +
       ' Адреса доставки: '+order_info.address+
        ' Телефон: ' +order_info.number+' Замовлення: ' +
        toStringPizzaList(order_info.orderList) + ' Разом ' + total;
}

function toStringPizzaList(orderList){
    var str='';
    var sizes ={small_size:'[Мала]',big_size:'[Велика]'};
    orderList.forEach(function(order){
        str+=' - '+order.quantity+' шт. '+sizes[order.size] + order.pizza.title+'; '
    });
    return str;
}

function calculateTotal(orderList){
    var total = 0;
    orderList.forEach(function(order){
        total += order.pizza[order.size].price*order.quantity;
    });
    return total;
}
