/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
// var Pizza_List = require('../Pizza_List');
 var Pizza_List = [];

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $filter_header = $('.left_panel .all_pizzas .filter_title');
var $filter_pizza_amount = $('.left_panel .all_pizzas .filter_pizza_count');

var pizza_filter_titles ={
    all:"Усі піци",
    meat:"М’ясні піци",
    pineapple:"Піци з ананнасами",
    mushroom:"Піци з грибами",
    ocean:"Піци з морепродуктами",
    vega:"Вегетаріанські піци"
};

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter, curr_filter_btn) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
         var pizzaContent= pizza.content;

         if(pizzaContent[filter])
             pizza_shown.push(pizza);
        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    changeActive(curr_filter_btn);
    changeFilterTitle(filter,pizza_shown.length);
}

function initialiseMenu() {
    //Показуємо усі піци
      API.getPizzaList(function(err,data){
         if(err){
             alert("Sorry:( Cannot load page now");
         }
         else{
             Pizza_List=data;
             showPizzaList(Pizza_List);
             var $pizza_pills = $('.pizza_pills');

             var filters = Object.keys(pizza_filter_titles);

             for(var i =1; i< filters.length-1;i++){
                 $pizza_pills.find('#'+filters[i]).click(function(){
                     filterPizza(this.id,$(this));
                 });
             }

             // $pizza_pills.find('#meat').click(function(){
             //    filterPizza(this.id,$(this));
             // });
             // $pizza_pills.find("#pineapple").click(function(){
             //     filterPizza(this.id,$(this));
             // });
             // $pizza_pills.find("#mushroom").click(function(){
             //     filterPizza(this.id,$(this));
             // });
             // $pizza_pills.find("#ocean").click(function(){
             //     filterPizza(this.id,$(this));
             // });

             $pizza_pills.find('#'+filters[filters.length-1]).click(function(){
                 var pizza_shown = [];
                 Pizza_List.forEach(function(pizza){
                     if(pizza.type ==='Вега піца')
                         pizza_shown.push(pizza);
                 });
                 showPizzaList(pizza_shown);
                 changeActive($(this));
                 changeFilterTitle(this.id,pizza_shown.length);
             });

             $pizza_pills.find('#'+filters[0]).click(function(){
                 showPizzaList(Pizza_List);
                 changeActive($(this));
                 changeFilterTitle(this.id,Pizza_List.length);
             });
         }
     });

}

function changeActive(current_active){
    $('.left_panel .all_pizzas .pizza_pills .active').removeClass('active');
    current_active.addClass('active');
}

function changeFilterTitle(filter_name, pizza_amount){
    $filter_header.text(pizza_filter_titles[filter_name]);
    $filter_pizza_amount.text(pizza_amount);
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;