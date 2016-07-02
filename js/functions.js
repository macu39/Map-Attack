
   var marker;
   localStorage.clear();

   function newGame(){
      var game = Math.floor((Math.random() * 18) + 1);
      localStorage.setItem("ngame", game);
      var url = 'getGame.php?g='+game+'&d=pista';
      ajax("pista",url);
      url = 'getGame.php?g='+game+'&d=solucion';
      ajax("solucion",url);

   }
   
   function newReGame(){
      var game = localStorage.getItem("ngame");
      var url = 'getGame.php?g='+game+'&d=pista';
      ajax("pista",url);
      url = 'getGame.php?g='+game+'&d=solucion';
      ajax("solucion",url);
   }

   function mostrarPista(pista){

      document.getElementById("game").innerHTML = "<center><h1>En que ciudad en encuentra el contenido de la pista?</h1>"
      +"<div id='cord'></div>"
      +"<div id='pista'>"+pista+"</div>"
      +"<div id='mright'>"
         +"<div id='map'></div>"
      +"</div>"
      +"<div id='validar'>"
         +"<span onclick='check()' class='btn btn-lg btn-primary btn-block'>Comprobar</span>"
      +"</div>";
      showMap();
      showCord();

   }

   function check(){
      
      var sol = localStorage.getItem("solucion").split(" ");
      var sLat = sol[0];
      var sLng = sol[1];
      var lat = document.getElementById("lat").value;
      var lng = document.getElementById("lng").value;
      
      //alert(sLat+" = "+lat+" | "+sLng+" = "+lng);
      
      if((sLat+10>=lat) && (lat>=sLat-10) && (sLng+10>=lng) && (lng>=sLng-10)){
         if(localStorage.getItem("win")!=null){
            localStorage.setItem("win", localStorage.getItem("win")+","+lat+" "+lng);
            correcto();
         }else{
            localStorage.setItem("win", lat+" "+lng);
            correcto();
         }
      }else{
         localStorage.setItem("mal", lat+" "+lng);
         incorrecto();
      }

   }
   
   function correcto(){
      document.getElementById("game").innerHTML = "<center><h1>Has Acertado!</h1><div id='mapc'></div>"
      +"<center><span onclick='newGame()' class='btn btn-lg btn-primary'>Jugar otra vez</span></center>";
      showMapCorrecto();
   }
   
   function incorrecto(){
      document.getElementById("game").innerHTML = "<center><h1>No Has Acertado!!?!</h1><div id='mapc'></div>"
      +"<center><span onclick='newReGame()' class='btn btn-lg btn-primary'>Vuelvelo a intentar</span></center>";
      showMapIncorrecto();
   }

   function showCord(){
      document.getElementById("cord").innerHTML = "<h3>Pincha en el mapa para seleccionar la localizacion: <u>Latitud</u> <input type='number' name='lat' id='lat' value='0'> <u>Longitud</u> <input type='number' name='lng' id='lng' value='0'></h3>";
   }

   function setCord(lat, lng){
      document.getElementById("lat").value = lat;
      document.getElementById("lng").value = lng;
   }

   function showMapCorrecto(){

      var latLng = new google.maps.LatLng(0, 0);

      var mapOptions = {
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        center: latLng
      };

      map = new google.maps.Map(document.getElementById('mapc'), mapOptions);
      
      //alert(localStorage.getItem("win"));       
      var markers = localStorage.getItem("win").split(",");
      var ruta = new Array();
      for(var i=0; i<markers.length; i++){
         
         var sol = markers[i].split(" ");
         var location = new google.maps.LatLng(sol[0], sol[1]);
         
         ruta.push(location); 
         
         new google.maps.Marker({
            position: location,
            map: map
         });
         
      }
      
      new google.maps.Polyline({        
         path: ruta,
         map: map, 
         strokeColor: '#FF8000', 
         strokeWeight: 4,  
         strokeOpacity: 0.8, 
         clickable: false     
      }); 
      
   }
   
   function showMapIncorrecto(){

      var latLng = new google.maps.LatLng(0, 0);

      var mapOptions = {
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        center: latLng
      };

      map = new google.maps.Map(document.getElementById('mapc'), mapOptions);
      
      var sol = localStorage.getItem("mal").split(" ");
      marker=null;
      placeMarker(new google.maps.LatLng(sol[0], sol[1]));
   }
   
   function showMap(){
      marker=null;
      var latLng = new google.maps.LatLng(0, 0);

      var mapOptions = {
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        center: latLng
      };

      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      google.maps.event.addListener(map, 'click', function(event) {

         setCord(event.latLng.lat(), event.latLng.lng());
         //marker = new google.maps.Marker({position: event.latLng, map: map});
         placeMarker(event.latLng);

      });
      
      google.maps.event.addListener(map, 'dblclick', function(event) {

         alert("hola");

      });
   }

   function placeMarker(location) {
     if ( marker ) {
       marker.setPosition(location);
     } else {
       marker = new google.maps.Marker({
         position: location,
         map: map
       });
     }
   }

   /*  AJAX function  */
   function ajax(action,url){

      var xmlhttp;
      if (window.XMLHttpRequest){
         // code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp=new XMLHttpRequest();
      }else{
         // code for IE6, IE5
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }

      xmlhttp.open("GET",url,true);
      xmlhttp.send();

      xmlhttp.onreadystatechange=function()
      {
         if (xmlhttp.readyState==4 && xmlhttp.status==200)
         {
            var response = xmlhttp.responseText;

            if(action == "pista"){
               mostrarPista(response);

            }else if(action == "solucion"){
               localStorage.setItem("solucion", response);
            }
         }
      }
   }
