function initLiqPay(data,signature){
    LiqPayCheckout.init({
        data:data,
        signature: signature,
        embedTo: "#liqPay",
        mode: "popup"	//	embed	||	popup
    }).on("liqpay.callback",	function(data){
        console.log(data.status);
        console.log(data);
    }).on("liqpay.ready",	function(data){
//	ready
    }).on("liqpay.close",	function(data){
//	close
    });
}

exports.initLiqPay = initLiqPay;