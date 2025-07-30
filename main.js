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
    if (['name', 'lat', 'lng', 'markerNumber'].includes(key)) continue;
    html += '<tr><th>' + key + '</th><td>' + city[key] + '</td></tr>';
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
    // 添加编号
    cities.forEach(function(city, idx) {
      city.markerNumber = idx + 1;
    });
    // 自定义带数字的marker
    var NumberedIcon = L.DivIcon.extend({
      options: {
        className: 'numbered-marker',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -36]
      }
    });
    cities.forEach(function(city) {
      var marker = L.marker([city.lat, city.lng], {
        icon: new NumberedIcon({
          html: '<div style="background:#2a93ee;color:#fff;border-radius:50%;width:28px;height:28px;line-height:28px;text-align:center;font-weight:bold;font-size:15px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);margin-top:7px;">' + city.markerNumber + '</div>'
        })
      }).addTo(map);
      marker.on('click', function() {
        showInfoPanel(city);
      });
    });
  });

map.on('click', function() {
  hideInfoPanel();
}); 