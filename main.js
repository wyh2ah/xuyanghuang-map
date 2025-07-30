var southWest = L.latLng(-85, -180),
    northEast = L.latLng(85, 180),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
}).setView([20, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap 贡献者',
  noWrap: true
}).addTo(map);

function showInfoPanel(city) {
  var infoPanel = document.getElementById('info-panel');
  var html = '<h2>' + city.name + '</h2><table>';
  for (var key in city) {
    if (['name', 'lat', 'lng', 'markerNumber', 'weighted FDI'].includes(key)) continue;
    html += '<tr><th>' + key + '</th><td>' + city[key] + '</td></tr>';
  }
  
  // 单独显示 weighted FDI，字体更大
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
    // 按 weighted FDI 降序排序
    cities.sort(function(a, b) {
      return parseFloat(b['weighted FDI']) - parseFloat(a['weighted FDI']);
    });
    
    cities.forEach(function(city) {
      // 根据 weighted FDI 值设置不同颜色的标记
      var fdiValue = parseFloat(city['weighted FDI']) || 0;
      var markerClass;
      
      if (fdiValue > 50) {
        markerClass = 'marker-strong'; // 深绿色 - 足球发展最强
      } else if (fdiValue > 30) {
        markerClass = 'marker-medium'; // 橙色 - 足球发展中等
      } else {
        markerClass = 'marker-weak'; // 浅灰色 - 足球发展较弱
      }
      
      // 使用默认的 Leaflet 标记，通过 CSS 类来改变颜色
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