var myMap = L.map("map", {
    center: [27.09, -100.71],
    zoom: 5
  });
 
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });


var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(Url, function(data) {   
    var features = data.features;
    console.log(features);
    for (var i = 0; i < data.features.length; i++) {
        // console.log(features[i].geometry.coordinates)
        var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
        // console.log(location)
        var mag = features[i].properties.mag
        var place = features[i].properties.place
        // console.log(mag);
        L.circle(location, {
                    fillOpacity: 0.5,
                    color: "yellow",
                    stroke: 0.02,
                    fillColor: "red",
                          // Setting our circle's radius equal to the output of our markerSize function
                          // This will make our marker's size proportionate to its population
                    radius: mag*8000
                        }).bindPopup("<h6>" + place + "</h6> <hr> <h5> Mag: " + mag+ "</h5>").addTo(myMap);                   //     
                    //   }
      
    }
   
});