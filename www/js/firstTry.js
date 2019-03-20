
///navigator.language example of method

        /*Localization Options 
        1- GPS - high battery consuming accuracy of 10ft
        2- Cell Tower triangulation - 30-100 meters
        3- Internet - No guarantee of accuracy because depends on the structure - 100 - 8000 meters
        
        properties:
        enableHighAccuracy: true (true - GPS | false - celltower or internet)
        timeout: 10000 (milliseconds to timeout request)
        maxAge: (how long to cache position also in milliseconds)
        */
    
    //    if(navigator['geolocation']){
    //        navigator.geolocation.getCurrentPosition(); }    
    
    //    if(navigator.geolocation){
    //        navigator.geolocation.getCurrentPosition();}

    const zorz0004 = {
        long: 0,
        lat: 0,
        map: {},
        init: function(){
            //Put in DOMContentLoaded callback
            zorz0004.getLocation()
            .then(
                document.addEventListener("load", () => {
                zorz0004.initMap();     
            }));
            
                
        },
        getLocation: function (){
            if("geolocation" in navigator){
                const opts = {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000 * 60 * 60 * 24 //(10000 ml times 60 is a minute times 60 is a hour times 24 is 24 hours in milliseconds)
                };
                navigator.geolocation.getCurrentPosition(zorz0004.gotPos, zorz0004.failPos, opts);
            }
            return true;
        },
    
        gotPos: function(position){
            let coords = position.coords;
            console.log(`${coords.latitude}, ${coords.longitude} with an accuracy of ${coords.accuracy} meters`);
            zorz0004.lat = coords.latitude;
            zorz0004.long = coords.longitude;
            
            
            // zorz0004.initMap();
            /*
            document.documentElement - refers to <html>
            document.body - refers to <body>
    
            Mozilla Dev Example
            var location = position.coords;
            console.log("Latitude: "+location.latitude);
            console.log("Longitude: "+location.longitude);
            console.log("Accuracy: "+location.accuracy + " meters");*/
        },
    
        failPos: function(err){
            let p = document.createElement('p');
            p.textContent = `${err.code} - ${err.message}`;
            document.body.appendChild(p); 
        },
    
        initMap: function(){
            console.log("initMap");
            let s = document.createElement("script"); 
            document.head.appendChild(s); 
    
            s.addEventListener("load", () => {
                console.log("script loaded")
                zorz0004.map = new google.maps.Map(document.getElementById('mymap'), {
                    center: {
                        lat: zorz0004.lat, 
                        lng: zorz0004.long
                    },
                    zoom: 8,
                    disableDoubleClickZoom: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                
                    // zorz0004.map.setCenter(new position.latLng(zorz0004.lat, zorz0004.long));
                    // console.log("done - " + zorz0004.map);
            
                zorz0004.map.addListener('dblclick', function(e){
                    zorz0004.placeMarkerAndPanTo(e.latLng, zorz0004.map);
                });
            })
    
    
    
        //   document.getElementById('mymap').addEventListener('dblclick', function(e){
        //     var position = e.latLng.lat();
        //     console.log(e.latLang);
        //         zorz0004.setPointer(position, zorz0004.map)
        //     })
    
        // zorz0004.map.addListener('dblclick', function(e){
        //     var marker = new google.maps.Marker({
        //         position: e.latLng,
        //         map: zorz0004.map
        //       });
        //       map.panTo(e.latLng);
        // });
    
        },
    
        addListener: function(){
            zorz0004.map.addListener('dblclick', function(e){
                zorz0004.placeMarkerAndPanTo(e.latLng, zorz0004.map);
            });
        },
        placeMarkerAndPanTo: function (latLng, map) {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map
            });
            map.panTo(latLng);
          },
    
        setPointer: function(position, map){
            console.log("MAP - " + map); 
            console.log("location - " + position);
            try{
            var marker = new google.maps.Marker({
                position: position,
                map: zorz0004.map,
                title: 'Click to zoom'
              });
            //map.panTo(marker.getPosition());
            map.setCenter(marker.getPosition());
            }
            catch(err){
                console.log("Error: " + err);
            }
    
            marker.addListener('click', function() {
                map.setZoom(8);
                map.setCenter(marker.getPosition());
              });
        }
    
    }
    
        if (document.deviceready) {
            document.addEventListener("deviceready", zorz0004.init);
        } else {
            document.addEventListener("DOMContentLoaded", zorz0004.init);
        }
    
    
        // Infowindow:
        // https://youtu.be/mfjqLmD6Li8