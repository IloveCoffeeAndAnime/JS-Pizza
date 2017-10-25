/**
 * Created by chaika on 02.02.16.
+ */
var Templates = require('../Templates');
var Storage = require('../LocalStorage');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var $clearCart =  $('.right_panel .right_panel_top .clear');

var $sum = $('#overall_sum');
var $sum_row=$('.right_panel_bottom .row');
var $orderBtn =$('.right_panel_bottom .order button');
var $emptyCart = $('.nothing_ordered');
var $orderCounter = $('.right_panel .right_panel_top .order_counter');

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    var nInCart = numberInCart(pizza,size);
    if(nInCart >= 0){
        Cart[nInCart].quantity+=1;
    }
    else{
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function numberInCart(pizza,size){
    for(var i=0; i < Cart.length;i++){
        if(JSON.stringify(Cart[i].pizza)===JSON.stringify(pizza) && Cart[i].size === size) return i;
    }
    return -1;
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    var index =Cart.indexOf(cart_item);
    Cart.splice(index,1);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders = Storage.get('cartStorage');
    if(saved_orders){
        Cart = saved_orders;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        updateOneCartItemSum(cart_item,$node);

        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function () {
            cart_item.quantity -= 1;
            if (cart_item.quantity === 0) removeFromCart(cart_item);
            updateCart();
        });

        $node.find(".remove").click(function () {
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }
    
    Cart.forEach(showOnePizzaInCart);

    Storage.set('cartStorage',Cart);
    updateOverallSum();
    $orderCounter.text(Cart.length);
}

function initializeClearCart(){
    $clearCart.click(function(){
        Cart=[];
        updateCart();
    });
}

function updateOverallSum(){
    var sum=0;
    var n = Cart.length;
    for(var i =0; i < n ; i++)
        sum += getPrice(Cart[i]);
    $sum.text(sum);
    if(sum===0){
        $sum_row.addClass('invisible');
        $orderBtn.addClass('disabled');
        $cart.append($emptyCart.show());
    }
    else{
        $sum_row.removeClass('invisible');
        $orderBtn.removeClass('disabled');
    }
}

function updateOneCartItemSum(cart_item, $cart_item_node){
    var price = getPrice(cart_item);
    var $pricePos=$cart_item_node.find('.pizza_options').find('.price').find('span');
    $pricePos.text(price+' грн.');
}

function getPrice(cart_item){
    var size= cart_item.size;
    return cart_item.pizza[size].price*cart_item.quantity;
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.initializeClearCart = initializeClearCart;

exports.PizzaSize = PizzaSize;

