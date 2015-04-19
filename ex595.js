

function addrSearch() {
   var inp = document.getElementById("addr");

   $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
    var items = [];

    $.each(data, function(key, val) {
      items.push(" <li><a href='#' onclick='chooseAddr(" + val.lat + ", " + val.lon + ", \"" + val.type + "\");return false;'>" 
      + val.display_name + '</a></li>'
    );
   });

   $('#results').empty();
    if (items.length != 0) {
      $('<p>', {html: "Search results:"}).appendTo('#results');
      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('#results');
    } else {
      $('<p>', {html: "No results found"}).appendTo('#results');
    }
    $('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
    $("#close").click(removeResults);
  });
}


function removeResults() {
   $("#results").empty();
}

function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);
  map.panTo(location);

  if (type == 'city' || type == 'administrative') {
    map.setZoom(11);
  } else {
    map.setZoom(13);
  }
}

$(document).ready(function() { 


    $("div#search button").click(addrSearch);
    //Creamos la variable map en el identificador "map" del div
    map = L.map('map');

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
     
    map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
  
    
    function onLocationFound(e) {
       var radius = e.accuracy / 2;
       //console.log(L.marker(e.latlng).getLatLng());
       L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point: " + '<br>'+ "Coordenadas: " + e.latlng.toString()).openPopup();
       L.circle(e.latlng, radius).addTo(map);
    }
    map.on('locationfound', onLocationFound);
  
    function onLocationError(e) {
       alert(e.message);
    }
    map.on('locationerror', onLocationError);

    var popup = L.popup();
    function onMapClick(e) {
       popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);  
    }
    map.on('click', onMapClick);

   //Gestión de las imágenes de Flirck
  $("#button").click(function(){
   //console.log($("input").val());
   var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?&jsoncallback=?";
   $.getJSON(flickerAPI, {
     tags: $("input").val(),
     tagmode: "any",
     format: "json"
   })
   .done(function(data) {
    imagenes = "";
    for (var i = 0; i < 5; i++) {
        imagenes = imagenes + '<img src=' + data.items[i].media.m + '/>';
    }
    $("#photos").html(imagenes);
   });
  });
  

   
});
