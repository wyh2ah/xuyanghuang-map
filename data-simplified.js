// Complete inline data with coordinates and all original data
window.INLINE_DATA = [
  [
    "City Name", 
    "Latitude", 
    "Longitude",
    "Government spending on football-related development ($)",
    "Investment scale from private or commercial sectors",
    "Registered football players",
    "Youth football participation rate",
    "Number of football clubs in the city",
    "Percentage of the population watching football games regularly on TV/online",
    "Average ticket sales for local football events",
    "Number of professional football players exported to other countries' leagues",
    "National top-tier football league international ranking",
    "Number of registered football coaches and referees",
    "Total market value of domestic football transfers",
    "Frequency of major football events hosted annually",
    "Market Share of Football Content",
    "Presence of Football Leagues in the Education System",
    "Unweighted FDI",
    "weighted FDI"
  ],
  [
    "London", 51.5074, -0.1278,
    12722074, 117775000, 2200000, 0.4, 704, 0.41, 80, 517, 1, 5800, 1700000000, 80, 0.7, "High", 71.1, 70.6
  ],
  [
    "Barcelona", 41.3851, 2.1734,
    30626180, 117775000, 1063090, 0.35, 110, 0.59, 85, 402, 2, 2500, 936526888, 75, 0.65, "High", 54.9, 52.6
  ],
  [
    "Tokyo", 35.6762, 139.6503,
    216050640, 9670000, 212600, 0.31, 32, 0.26, 35, 123, 7, 1200, 102171136, 45, 0.4, "Moderate", 29.2, 30.1
  ],
  [
    "Miami", 25.7617, -80.1918,
    4000000, 48930000, 2791, 0.071, 15, 0.12, 65, 17, 12, 600, 70000000, 30, 0.2, "Low", 11.6, 10.5
  ],
  [
    "Manchester", 53.4808, -2.2426,
    20511825, 468391175, 1200000, 0.38, 165, 0.47, 70, 497, 1, 4600, 1800000000, 70, 0.75, "High", 65.6, 63.2
  ],
  [
    "Paris", 48.8566, 2.3522,
    55354250, 10000000, 1906977, 0.43, 47, 0.33, 55, 354, 5, 1800, 468236036, 60, 0.6, "High", 45.7, 46.2
  ],
  [
    "Rio de Janeiro", -22.9068, -43.1729,
    18619989, 19440000, 2100000, 0.49, 91, 0.48, 15, 1076, 6, 1300, 300815007, 70, 0.5, "High", 48.5, 48.6
  ],
  [
    "Melbourne", -37.8136, 144.9631,
    3960000, 7960000, 1865000, 0.15, 72, 0.18, 30, 84, 26, 900, 400600763, 15, 0.1, "Low", 16.6, 18.4
  ],
  [
    "Shanghai", 31.2304, 121.4737,
    169680000, 39720000, 30723, 0.094, 67, 0.13, 35, 2, 94, 420, 69687400, 40, 0.25, "Low", 21.1, 22.3
  ],
  [
    "Milan", 45.4642, 9.1900,
    1895090, 51130000, 978693, 0.26, 101, 0.43, 85, 128, 3, 2150, 351201696, 65, 0.65, "High", 43.1, 40.8
  ],
  [
    "Berlin", 52.5200, 13.4050,
    18667337, 5470000, 1020189, 0.32, 28, 0.46, 40, 185, 4, 1750, 585217500, 55, 0.6, "Moderate", 34.9, 33.9
  ],
  [
    "Buenos Aires", -34.6118, -58.3960,
    14041, 11820000, 331811, 0.47, 32, 0.61, 18, 813, 8, 2100, 40372673, 75, 0.55, "High", 42.7, 40.8
  ],
  [
    "Cape Town", -33.9249, 18.4241,
    1627640, 6310000, 61000, 0.11, 60, 0.2, 20, 68, 56, 380, 20917384, 25, 0.2, "Moderate", 12.8, 13.0
  ],
  [
    "Kolkata", 22.5726, 88.3639,
    119530, 19950000, 175478, 0.16, 126, 0.35, 13, 21, 127, 450, 29141740, 35, 0.07, "Low", 17.8, 18.6
  ],
  [
    "Porto", 41.1579, -8.6291,
    5841640, 9830000, 192000, 0.34, 30, 0.39, 45, 276, 9, 1400, 140452200, 45, 0.5, "High", 31.8, 30.6
  ]
];

// Function to use inline data
function loadInlineData() {
  if (window.INLINE_DATA && window.INLINE_DATA.length > 0) {
    console.log('Loading inline data...');
    window.excelParser.parseData(window.INLINE_DATA);
    const cities = window.excelParser.getCities();
    
    if (cities.length > 0) {
      loadCitiesData(cities);
      console.log('Cities loaded from inline data:', cities.length, 'cities found');
      return true;
    }
  }
  return false;
}
