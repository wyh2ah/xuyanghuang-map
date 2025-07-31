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

// Global variable to store current cities data
var currentCities = [];

function showInfoPanel(city) {
  var infoPanel = document.getElementById('info-panel');
  var html = '<h2>' + city.name + '</h2><table>';
  
  // Display all city data except excluded fields, ignore null/undefined/NaN values
  for (var key in city) {
    if (['name', 'lat', 'lng', 'markerNumber', 'weighted FDI'].includes(key)) continue;
    
    var value = city[key];
    // Skip null, undefined, NaN, empty string values
    if (value === null || value === undefined || value === '' || 
        (typeof value === 'number' && isNaN(value))) continue;
    
    // Format large numbers with commas
    if (typeof value === 'number' && value > 1000) {
      value = value.toLocaleString();
    }
    
    html += '<tr><th>' + key + '</th><td>' + value + '</td></tr>';
  }
  
  html += '</table>';
  
  // Dynamically add weighted FDI if it exists and is valid
  if (city['weighted FDI'] && !isNaN(city['weighted FDI'])) {
    html += "<div class='fdi-container'>";
    html += "<table><tr class='fdi-header'><th colspan='2'>Weighted FDI</th></tr>";
    html += "<tr class='fdi-value'><th colspan='2'>" + city['weighted FDI'] + "</th></tr></table>";
    html += "</div>";
    html += "<div style='height: 30px;'></div>";
  }

  infoPanel.innerHTML = html;
  infoPanel.classList.remove('hidden');
}

function hideInfoPanel() {
  var infoPanel = document.getElementById('info-panel');
  infoPanel.classList.add('hidden');
}

// Function to load and display cities data
function loadCitiesData(cities) {
  // Clear existing markers
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Sort cities by development index (highest first)
  cities.sort(function(a, b) {
    var aFdi = parseFloat(a['weighted FDI']) || 0;
    var bFdi = parseFloat(b['weighted FDI']) || 0;
    return bFdi - aFdi;
  });
  
  currentCities = cities;
  
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
}

// Function to handle Excel file upload
function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      window.excelParser.parseData(jsonData);
      const cities = window.excelParser.getCities();
      
      console.log('Excel file uploaded and parsed successfully:', cities.length, 'cities found');
      loadCitiesData(cities);
      
      // Hide upload control after successful load
      const uploadControl = document.getElementById('upload-control');
      if (uploadControl) {
        uploadControl.style.display = 'none';
      }
      
    } catch (error) {
      console.error('Error parsing uploaded Excel file:', error);
      alert('Error parsing Excel file: ' + error.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Try to load inline data first, then JSON file, then Excel file, then show upload option
async function loadData() {
  try {
    // First try to load inline data
    if (window.INLINE_DATA && window.INLINE_DATA.length > 0) {
      try {
        window.excelParser.parseData(window.INLINE_DATA);
        const cities = window.excelParser.getCities();
        
        if (cities.length > 0) {
          loadCitiesData(cities);
          return;
        }
      } catch (inlineError) {
        console.warn('Failed to load inline data:', inlineError);
      }
    }
    
    // Fallback to data.json (converted from Excel)
    try {
      const jsonResponse = await fetch('data.json');
      
      if (jsonResponse.ok) {
        const jsonData = await jsonResponse.json();
        window.excelParser.parseData(jsonData);
        const cities = window.excelParser.getCities();
        
        if (cities.length > 0) {
          loadCitiesData(cities);
          return;
        }
      }
    } catch (jsonError) {
      console.log('data.json not found, trying data.xlsx...');
    }
    
    // Fallback to Excel file
    const checkResponse = await fetch('data.xlsx', { method: 'HEAD' });
    
    if (checkResponse.ok) {
      const cities = await window.excelParser.loadExcelFromRepo('data.xlsx');
      if (cities.length > 0) {
        loadCitiesData(cities);
        return;
      }
    }
    
    throw new Error('No data sources accessible');
    
  } catch (error) {
    console.error('Failed to load data files:', error);
    showUploadControl();
  }
}

// Show upload control for manual file selection
function showUploadControl() {
  let uploadControl = document.getElementById('upload-control');
  if (!uploadControl) {
    uploadControl = document.createElement('div');
    uploadControl.id = 'upload-control';
    uploadControl.style.cssText = `
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.98);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    uploadControl.innerHTML = `
      <label for="excel-upload" style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #2563eb;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
        📊 Upload data.xlsx
      </label>
      <input type="file" id="excel-upload" accept=".xlsx,.xls" style="display: none;">
      <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
        Select the data.xlsx file from your computer
      </div>
    `;
    document.body.appendChild(uploadControl);
    
    document.getElementById('excel-upload').addEventListener('change', handleExcelUpload);
  }
  uploadControl.style.display = 'block';
}

// Initialize data loading when page loads
function initializeMap() {
  if (window.excelParser) {
    loadData();
  } else {
    setTimeout(initializeMap, 100);
  }
}

// Wait for all scripts to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMap);
} else {
  initializeMap();
}

map.on('click', function() {
  hideInfoPanel();
}); 