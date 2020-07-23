queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function color(mag) {
  if (mag > 5) {return "#ff3333"};
  if (mag > 4) {return "#ff8b33"};
  if (mag > 3) {return "#ffbb33"};
  if (mag > 2) {return "#ffe733"};
  if (mag > 1) {return "#cfff33"};
  return "#33ff36";
}

function createFeatures(earthquakeData) {

  function addDetails(feature, layer) {
    layer.bindPopup("<h3 style = 'text-align: center'> Magnitude " + feature.properties.mag + "<br>"+ feature.properties.place + "<br>"
    + new Date(feature.properties.time)+"<br><a target='_blank' href='" + feature.properties.url +"'>More info</a>" );
  };

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: addDetails,
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag *3,
        fillColor: color(feature.properties.mag),
        weight: 1,
        opacity: 1,
        color: "black",
        fillOpacity: 1
    });}
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var myMap = L.map("map", {
    center: [0,0],
    zoom: 2,
  });

  streetmap.addTo(myMap);
  earthquakes.addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');

      for (var i = 0; i < 6; i++) {
          div.innerHTML +=
              '<i style="background:' + color(i+1) + '"></i> ' +
              i + (i<5 ? '&ndash;' + (i+1) + '<br>' : '+');
      }

      return div;
  };
  legend.addTo(myMap);

}
