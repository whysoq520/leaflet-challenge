// Creating map object
var map = L.map("map", {
    center: [23.7128, -25.0059],
    zoom: 2
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);
  
  // If data.beta.nyc is down comment out this link
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  function getColor(d) {
    return d > 9  ? '#800080' :
           d > 8  ? '#800000' :
           d > 7  ? '#B22222' :
           d > 6  ? '#FF0000' :           
           d > 5  ? '#DC143C' :
           d > 4  ? '#FF00FF' :	
           d > 3  ? '#F08080' :
           d > 2  ? '#FFA07A' :
           d > 1  ? '#FFDAB9' :           
           d > 0  ? '#E6E6FA' :
                    '#FFEDA0';
            }


  // Grabbing our GeoJSON data..
    d3.json(link, function(data) {
    //console.log(data);
  //   var features = data.features
  //   var Mag =[]
  // for (var i = 0; i< features.length; i++) {
  //   Mag.push(features[i].properties.mag);
  // }
  // console.log(Mag)
  // var MagMax = d3.max(Mag);
  // var MagMin = d3.min(Mag);
  // console.log(MagMax)
  // console.log(MagMin)
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p> MAG:" + (feature.properties.mag) + "</p>");    
      };
   
      console.log(data.features);
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data,{      
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag*1.2,
          fillColor: getColor(feature.properties.mag),
          color: "white",
          weight: 0.05,
          opacity: 0.5,
          fillOpacity: 0.7
      });
    }
})
.addTo(map);  


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


// // Set up the legend
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend");
//   var limits = geojson.options.limits;
//   var colors = geojson.options.colors;
//   var labels = [];

//   // Add min & max
//   var legendInfo = "<h1>EArthquakes</h1>" +
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

// // Adding legend to the map
// legend.addTo(Map);

});

