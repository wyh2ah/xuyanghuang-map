var southWest = L.latLng(-85, -180),
    northEast = L.latLng(85, 180),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
}).setView([20, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
  noWrap: true
}).addTo(map);

function showInfoPanel(city) {
  var infoPanel = document.getElementById('info-panel');
  var html = '<h2>' + city.name + '</h2><table>';
  for (var key in city) {
    if (['name', 'lat', 'lng', 'markerNumber', 'weighted FDI'].includes(key)) continue;
    html += '<tr><th>' + key + '</th><td>' + city[key] + '</td></tr>';
  }
  
  // Show weighted FDI prominently
  if (city['weighted FDI']) {
    html += "<tr><th colspan='2'>Weighted FDI</th></tr>";
    html += "<tr><th colspan='2'>" + city['weighted FDI'] + "</th></tr>";
  }
  
  html += '</table>';

  infoPanel.innerHTML = html;
  infoPanel.classList.remove('hidden');
}

function hideInfoPanel() {
  var infoPanel = document.getElementById('info-panel');
  infoPanel.classList.add('hidden');
}

fetch('cities.json')
  .then(response => response.json())
  .then(cities => {
    // Sort cities by development index (highest first)
    cities.sort(function(a, b) {
      return parseFloat(b['weighted FDI']) - parseFloat(a['weighted FDI']);
    });
    
    cities.forEach(function(city) {
      // Color-code markers based on development level
      var fdiValue = parseFloat(city['weighted FDI']) || 0;
      var markerClass;
      
      if (fdiValue > 50) {
        markerClass = 'marker-strong'; // Established football hubs
      } else if (fdiValue > 30) {
        markerClass = 'marker-medium'; // Growing football markets
      } else {
        markerClass = 'marker-weak'; // Emerging football regions
      }
      
      // Add markers to map with custom styling
      var marker = L.marker([city.lat, city.lng]).addTo(map);
      marker.getElement().classList.add(markerClass);
      marker.on('click', function() {
        showInfoPanel(city);
      });
    });
  });

map.on('click', function() {
  hideInfoPanel();
}); 