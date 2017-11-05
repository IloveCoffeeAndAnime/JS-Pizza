/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
   // var API = require('./API');
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var PizzaOrder = require('./PizzaOrder');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    PizzaCart.initializeClearCart();
    PizzaOrder.initializePage();
});