// store API as queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson?minlatitude=24.396308&maxlatitude=49.384358&minlongitude=-125.000000&maxlongitude=-66.934570";

// get request to the query URL
d3.json(queryURL).then(function(data) {
  // data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // colour features representing depths
  function getColor(depth) {
    if (depth < 10) {
      return "dbd293";
    } else if (depth < 30) {
      return "greenyellow";
    } else if (depth < 50) {
      return "#yellow";
    } else if (depth < 70) {
      return "#orange";
    } else if (depth < 90) {
      return "#orangered";
    } else {
      return "#8ba4c7";
    }
  }

  // defining functions we want to run for the array
  // provide each feature a popup that describes the place, magnitude, and depth of the earthquakes
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // creat a geojson layer that contains the features array 
  // run the onEachFeature function once for each piece of data
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  // send earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // create base layers
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // create a baseMaps object
  var baseMaps = {
    "Street Map": street,

  };

  // create an overlay object
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // create our map
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 10,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
}