// initialize variables to use when first loading map
var myMap = null;
var zoom_level = 10;
var center_coords = [30.266667,-97.733333];

// create function called getLegendColor that will determine legend color based on school enrollment size
// if enrollment > 1000, make legend color red (hex value below came from HTML color picker)
// if enrollment 500-1000, make legend color blue (hex value below came from HTML color picker)
// if enrollment < 500, make legend color green (hex value below came from HTML color picker)
function getLegendColor(d) {
  console.log("Inside getColor. value of d is: ", d);
  return d > 1000 ? '#e60000' :
         d > 500  ? '#0080ff' :
                    '#2eb82e';
}


// create function called getIconColor that will determine marker color based on school enrollment size
function getIconColor (enrollment_size) {

  // initialize icon colors
  var greenIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var blueIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var redIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // if enrollment size is greater than 1000, make the marker color red
  if (enrollment_size > 1000) {
    var marker_color = redIcon;
  }
  // if enrollment size is greater than 500 but less than 1000, make the marker color blue
  else if (enrollment_size > 500) {
    var marker_color = blueIcon;
  }
  // if enrollment size is less than 500, make the marker color green
  else {
    var marker_color = greenIcon;
  }

  return marker_color;
}

// create function called createMap passing in schools json that will output map with markers
// also passing in zoom level and center coordinates
function createMap(schools, zoom_l, center_cds) {

  console.log('Inside createMap function, schools is: ', schools);

//  ================================================================================
// An array which will be used to store created cityMarkers
var markers = [];



for (var i = 0; i < schools.length; i++) {
  console.log('schools_i_location is: ', schools[i].location);

  // set variable called icon_value to function that will determine marker color based on school enrollment size
  var icon_color = getIconColor(schools[i].enrollment);


  // loop through the cities array, create a new marker, push it to the cityMarkers array
  // note that they are not added to the map immediately
  // marker tooltip first line show campus name, second line address & zipcode, third line district name
  markers.push(
    L.marker(schools[i].location, {icon: icon_color}).bindPopup("<h5>" + schools[i].campus_name + "</h5>" +
	"<hr><h5>" + schools[i].address + " " + schools[i].zipcode + "</h5>" +
	"<hr><h5>" + schools[i].district + "</h5>")
  );
}

// Add all the school markers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
var schoolsLayer = L.layerGroup(markers);


// Define variables for our tile layers
// again, not added immediately
var street = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// this toggles the light and dark modes for the map
// the object keys are what is displayed for the control buttons
// the values are the above defined layers
var baseMaps = {
  Color: street,
  Light: light,
  Dark: dark
};

// markers Overlays that may be toggled on or off
var overlayMaps = {
  Schools: schoolsLayer
};

console.log(myMap); // should output the object that represents instance of Leaflet
if(myMap !== null) {
  myMap.remove(); // should remove the map from UI and clean the inner children of DOM element
  console.log('after removing, myMap is: ', myMap); // nothing should actually happen to the value of mymap
}

// Create map object and set default layers
myMap = L.map("map", {
  center: center_cds,
  zoom: zoom_l,
  layers: [street, schoolsLayer] //this is a new addition that shows the default settings
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Set up the legend in the bottom right position
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    // create 'info legend' div element
    var div = L.DomUtil.create('div', 'info legend'),
    // set up the legend intervals by enrollment sizes (1-500, 500-1000, 1000+)
    enr_sizes = [1, 500, 1000],
    // create array called labels and start with text 'Enrollment Sizes:'
    labels = ['Enrollment Sizes:'];

    // loop through magnitudes intervals and generate a label with a colored square for each interval
    for (var i = 0; i < enr_sizes.length; i++) {
        div.innerHTML +=
            labels.push(
              '<li style="background:' + getLegendColor(enr_sizes[i] + 1) + '"></li> ' +
            enr_sizes[i] + (enr_sizes[i + 1] ? '&ndash;' + enr_sizes[i + 1] + '<br>' : '+'));
}
    div.innerHTML = labels.join('<br>');
return div;
};
legend.addTo(myMap);

setTimeout(function () { myMap.invalidateSize() }, 1200);
console.log('myMap is: ', myMap);

}


// create initial map for first page load
// pass in tableData, the initial zoom_level and center coordinates we initialized above
createMap(tableData, zoom_level, center_coords);
