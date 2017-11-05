var Templates = require('./Templates');
var API = require('./API');
var Storage = require('./LocalStorage');
var Cart = require('./pizza/PizzaCart');

var $input_name=$('#name_input');
var $number_input=$('#number_input');
var $address_input=$('#address_input');
var $name_group=$('.name_group');
var $number_group=$('.number_group');
var $address_group=$('.address_group');
var $order_list=$('#order_list');
var $nextBtn =$('#next_step1');
var OrderList = [];

function checkInputs(){
    $input_name.bind('input propertychange',function(){
        var val = $input_name.val();
        if( val==="" || containsNumbers(val))
            setInvalid($name_group);
        else
            setValid($name_group);
    });

    $number_input.bind('input propertychange',function(){
        var val =$number_input.val();
        console.log(val);
        if(isNumber(val) && Number.parseInt(val)>=0)
            setValid($number_group);
        else
            setInvalid($number_group);
    });

    $address_input.bind('input propertychange',function(){
        if($address_input.val() !=="")
            setValid($address_group);
        else
            setInvalid($address_group);
    });
}

function setInvalid(element){
    element.addClass('has-error');
    element.removeClass('has-success');
}

function setValid(element){
    element.addClass('has-success');
    element.removeClass('has-error');
}

function containsNumbers(string){
    for(var i=0;i<string.length;i++){
        if(Number.parseInt(string[i])) return true;
    }
    return false;
}

function isNumber(val){
    for(var i=1;i<val.length;i++){
        if(!Number.parseInt(val[i])) return false;
    }
    return true;
}

function initializeOrderList(){
    OrderList=Cart.getPizzaInCart();
    showOrders();
}

function showOrders(){
    OrderList.forEach(showOneOrder);

}
function showOneOrder(order_item){
    var html_code=Templates.PizzaOrder_OneItem(order_item);
    var $node=$(html_code);
    $order_list.append($node);
}

function sendOrder(){
    API.createOrder(OrderList,function(err,data){
        if(err)
            alert("Error while trying to send order to the server");
        else
            alert("Successfully sent:)");

    });
}

function initializePage(){
    checkInputs();
    initializeOrderList();
    $nextBtn.click(function(){
        sendOrder();
    });
}
exports.initializePage=initializePage;