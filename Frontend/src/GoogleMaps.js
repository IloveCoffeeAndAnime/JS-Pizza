var PizzaOrder = require('./PizzaOrder');

var map_div = document.getElementById('googleMap');
var $address_input = $('#address_input');
var $order_address= $('#summery_order_address');
var $order_time = $('#summery_order_time');

function initialize(){
    var point = new google.maps.LatLng(50.464379,30.519131);
    var mapProp = {
        center: point,
        zoom:15
    };
    var map = new google.maps.Map(map_div,mapProp);
    var direction_service = new google.maps.DirectionsService();
    var directions_display = new google.maps.DirectionsRenderer( { map:map, suppressMarkers:true} );

    var pizza_marker = new google.maps.Marker({
        position:point,
        map:map,
        icon:"assets/images/map-icon.png"
    });

    var house_marker = new google.maps.Marker({
        position:null,
        map:null,
        icon:"assets/images/home-icon.png"
    });

    google.maps.event.addListener(map,'click',function(me){
        var coordinates = me.latLng;
        placeMarker(house_marker,coordinates,map);
        geocodeLatLng(coordinates,showAddress);
        calculateRoute(direction_service,point,coordinates,directions_display,showTimeAndRoute);
    });

    $address_input.bind('input propertychange',function(){
        var address = $address_input.val();
        $order_address.text(address);
        geocodeAddress(address,function(err,coordinates){
            if(!err) {
                placeMarker(house_marker, coordinates, map);
                calculateRoute(direction_service,point, coordinates,directions_display, showTimeAndRoute);
            }});

    });
}

function geocodeLatLng(coordinates,callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location':coordinates}, function(results,status){
        if(status === google.maps.GeocoderStatus.OK && results[1]){
            var address = results[1].formatted_address;
            console.log(results);
            callback(null,address);
        }
        else{
            callback(new Error("Address not found"));
        }
    });
}

function showAddress(err,address){
    if(err){
        $address_input.val(err.message);
    }else{
        $address_input.val(address);
        $order_address.text(address);
        PizzaOrder.setValid($order_address);
    }
}

function geocodeAddress(address, callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address':address}, function(results,status){
        if(status === google.maps.GeocoderStatus.OK && results[0]){
            var coordinates = results[0].geometry.location;
            callback(null,coordinates);
        }else{
            callback(new Error('Address not found'));
        }
    });
}

function placeMarker(marker,coordinates,map){
    marker.setPosition(coordinates);
    marker.setMap(map);
}

function calculateRoute(direction_service, A_coordinates, B_coordinates,directions_display, callback){
    direction_service.route({
        origin: A_coordinates,
        destination: B_coordinates,
        travelMode: google.maps.TravelMode['DRIVING']
    }, function(response,status){
        if(status === google.maps.DirectionsStatus.OK){
            callback(null, {response:response, directions_display:directions_display});
            console.log(response);
        } else{
            callback(new Error('Direction not found'));
        }
    });
}

function showTimeAndRoute(err,result){
    if(err){
        $order_time.text('невідомий');
    }else{
        var time =result.response.routes[0].legs[0].duration.text;
        $order_time.text(time);
        result.directions_display.setDirections(result.response);
    }
}
google.maps.event.addDomListener(window,'load',initialize);