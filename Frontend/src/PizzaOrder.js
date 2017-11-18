var Templates = require('./Templates');
var API = require('./API');
var Cart = require('./pizza/PizzaCart');
var LiqPay = require('./LiqPay');

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
        if(isNumber(val))
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
    element.find('.input_holder .message').show();
}

function setValid(element){
    element.addClass('has-success');
    element.removeClass('has-error');
    element.find('.input_holder .message').hide();
}

function containsNumbers(string){
    var val;
    for(var i=0;i<string.length;i++){
        val=Number.parseInt(string[i]);
        if(val === val) return true;
    }
    return false;
}

function isNumber(val){
    var numb=Number.parseInt(val[0]);
    if(val[0] !=='+' && numb!==numb) return false;
    for(var i=1;i<val.length;i++){
        numb=Number.parseInt(val[i]);
        if(numb!==numb) return false;
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
    var inf = {name:$input_name.val(),
        number:$number_input.val(),
        address:$address_input.val(),
        orderList:OrderList
    };
    API.createOrder(inf,function(err,res){
        if(err)
            alert("Error while trying to send order to the server");
        else{
            console.log("Successfully sent:)");
            LiqPay.initLiqPay(res.data,res.signature);
        }
    });
}

function everythingValid(){
    var name= $input_name.val();
    var number=$number_input.val();
    var address=$address_input.val();
  if (name==="" || containsNumbers(name))return false;
  if (!isNumber(number)) return false;
  if (address ==="") return false;
    else return true;
}

function initializePage(){
    checkInputs();
    initializeOrderList();

    $nextBtn.click(function(){
        if(everythingValid()){
            sendOrder();
        }
    });
}

exports.initializePage=initializePage;
exports.setValid = setValid;
exports.setInvalid =setInvalid;