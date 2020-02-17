//set baselayers 

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

 
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var basemaps = {
    Satellite: satellite,
    Street: street,
    Outdoors: outdoors
  };

// plot map 
var mymap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [satellite,street,outdoors ]
});

//create the variable layers for our two different sets of data, earthquakes and tectonicplates.
var tectonlayers = new L.LayerGroup();
var earthquakelayers = new L.LayerGroup();
//setting  datalayer an object that contains all of our overlays. Any combination of
// these overlays may be visible at the same time!
var overlays = {
  Tectoniclayer: tectonlayers,
  Earthquakes: earthquakelayers
};

// add control
L.control.layers(basemaps, overlays).addTo(mymap);


// apply earthquake data and plot, add to the right layer and add the layer to the map
function getColor(d) {
  return d > 5  ? '#eb3734' :
         d > 4  ? '#eb6534' :	
         d > 3  ? '#e5eb34' :
         d > 2  ? '#34eb37' :
         d > 1  ? '#7CFC00' :
         d > 0  ? '#ADFF2F' :        
                   '#FFEDA0';
          };
// Perform a GET request to the query URL
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(Url, function(data) {   
    var features = data.features;
    console.log(features);
    for (var i = 0; i < features.length; i++) {
        // console.log(features[i].geometry.coordinates)
        var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
        // console.log(location)
        var mag = features[i].properties.mag
        var place = features[i].properties.place
        // console.log(mag);
       L.circle(location, {
                    fillOpacity: 0.75,
                    color: getColor(features[i].properties.mag),
                    stroke: 0.01,
                    fillColor: getColor(features[i].properties.mag),
                    radius: mag*18000
                    }).bindPopup("<h6>" + place + "</h6> <hr> <h5> Mag: " + mag+ "</h5>").addTo(earthquakelayers);
                  };
        earthquakelayers.addTo(mymap);
        });
       
   

// apply tecton data and plot, add to the right layer and add the layer to the map
var tecton = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tecton, function (plateData) {
  var tecton =L.geoJSON(plateData,
      {
        color: 'orange',
        weight: 2
      }).addTo(tectonlayers)
  }) 

tectonlayers.addTo(mymap);


// add info control 
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [ 0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap);
