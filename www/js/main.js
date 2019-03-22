/* 
File: main.js
Course: MAD-9022
Student: Marcos Zorzi Rosa
Project: FINDR
Date: Mar 15 2019 */


const zorz0004 = {
    long: 0,
    lat: 0,
    map: {},
    init: async function(){
        zorz0004.initMap();
   
    },

    initMap: function(){
        //getPosition
        if("geolocation" in navigator){
            const opts = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000 * 60 * 60 * 24 //(10000 ml times 60 is a minute times 60 is a hour times 24 is 24 hours in milliseconds)
            };
            navigator.geolocation.getCurrentPosition(function(position){
                let coords = position.coords;
                console.log(`${coords.latitude}, ${coords.longitude} with an accuracy of ${coords.accuracy} meters`);
                zorz0004.lat = coords.latitude;
                zorz0004.long = coords.longitude;

                //google maps
                zorz0004.map = new google.maps.Map(document.getElementById('mymap'), {
                    zoom: 10,
                    center: {
                        lat: zorz0004.lat, 
                        lng: zorz0004.long},
                    disableDoubleClickZoom: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                
                //dblclick listener
                zorz0004.map.addListener('dblclick', function(e) {
                    //console.log(e);
                    zorz0004.placeMarkerAndPanTo(e.latLng, zorz0004.map);
                });  

                //Populate saved markers
                if(localStorage.length != null){
                    zorz0004.setSavedMarkers();
                }


            }, function(err){
                let p = document.createElement('p');
                p.textContent = `${err.code} - ${err.message}`;
                document.body.appendChild(p); 
            }, opts);
        }else{
            alert("FINDR could not access your location service");
        }

    },

    placeMarkerAndPanTo: function(latLng, map){
        let marker = new google.maps.Marker({
            position: latLng,
            map: map,
            click: true
        });
        //center map on marker
        map.panTo(latLng);

        //ask for label
        var myContent = zorz0004.labelPrompt();
        
        //User click Cancel
        if(myContent == null){
            zorz0004.initMap();
        }else{
            marker.addListener("click", function(el){
                if(typeof infowindow != "undefined") infowindow.close();
                infowindow = new google.maps.InfoWindow({
                    content: myContent
                });
                infowindow.open(zorz0004.map, marker);
            })
    
            //save to localStorage
            let element = {
                id: Date.now(),
                position: latLng,
                label: myContent
            }
            localStorage.setItem(element.id,JSON.stringify(element));
            //Update markers on map
            zorz0004.setSavedMarkers();
        }
    },
    labelPrompt: function(){
        var info = prompt("Please a name for your marker");
            if (info != null) {
              return(info);
            };
    },

    setSavedMarkers: function(){
        var myStorage = [];
        for(let i=0; i <= localStorage.length; i++){
            let storage = localStorage.getItem(localStorage.key(i));
            if(storage != null){
                myStorage[i] = JSON.parse(storage);
            }
        }
        //console.log(myStorage);

        myStorage.forEach(element =>{
            var savedMarker = new google.maps.Marker({
                position: element.position,
                map: zorz0004.map,
                click: true
            });


            let div = document.createElement("div");
            let h1 = document.createElement("h1");
            let p = document.createElement("p");
            let button = document.createElement("button");
            
            div.classList.add(element.id);
            h1.textContent = element.label;
            p.textContent = "lat: "+JSON.stringify(element.position.lat) + ", lng:" + JSON.stringify(element.position.lng);
            button.setAttribute("id", element.id);
            button.textContent = "Remove";

            div.appendChild(h1);
            div.appendChild(p);
            div.appendChild(button);

            savedMarker.addListener("click", function(el){
                if(typeof infowindow != "undefined") infowindow.close();
                infowindow = new google.maps.InfoWindow({
                    content: div
                });
                infowindow.open(zorz0004.map, savedMarker); 
            });

            //Add remove button listener
            button.addEventListener("click", async function(){
                // console.log('remove === '+ JSON.stringify(element));
                await zorz0004.RemoveMarker(element);
                //Update markers on map
                await zorz0004.initMap();
                //await savedMarker.setMap(null); -- Don't work, the marker still on page with odd infowindow.
                zorz0004.setSavedMarkers();
            });
        })
    },

    RemoveMarker: async function(el){
        // console.log(el);
        infowindow.close();
        localStorage.removeItem(el.id);
        return true;
    }
}


if (document.deviceready) {
    document.addEventListener("deviceready", zorz0004.init);
} else {
    document.addEventListener("DOMContentLoaded", zorz0004.init);
}