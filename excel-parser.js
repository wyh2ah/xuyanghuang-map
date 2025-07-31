// Excel parser for dynamic data loading
class ExcelParser {
    constructor() {
        this.cities = [];
        this.headers = [];
    }

    // Load Excel file from repository
    async loadExcelFromRepo(filename = 'data.xlsx') {
        try {
            console.log(`Attempting to fetch ${filename}...`);
            const response = await fetch(filename);
            console.log(`Fetch response status: ${response.status} ${response.statusText}`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
            }
            
            console.log('Fetching array buffer...');
            const arrayBuffer = await response.arrayBuffer();
            console.log(`Array buffer size: ${arrayBuffer.byteLength} bytes`);
            
            const data = new Uint8Array(arrayBuffer);
            console.log('Reading Excel workbook...');
            const workbook = XLSX.read(data, { type: 'array' });
            console.log('Available sheets:', workbook.SheetNames);
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            console.log(`Using sheet: ${firstSheetName}`);
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log(`Raw data rows: ${jsonData.length}`);
            
            this.parseData(jsonData);
            return this.cities;
        } catch (error) {
            console.error('Detailed error loading Excel file:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    // Parse the raw Excel data into structured city objects
    parseData(rawData) {
        if (rawData.length < 2) {
            throw new Error('Excel file must have at least 2 rows (header + data)');
        }

        // First row should contain headers
        this.headers = rawData[0];
        this.cities = [];

        console.log('Excel headers found:', this.headers);

        // Find required column indices
        const nameIndex = this.findColumnIndex(['name', 'city', 'city name']);
        const latIndex = this.findColumnIndex(['lat', 'latitude']);
        const lngIndex = this.findColumnIndex(['lng', 'longitude', 'lon']);
        const fdiIndex = this.findColumnIndex(['weighted fdi', 'fdi', 'weighted_fdi']);

        console.log('Column indices:', { nameIndex, latIndex, lngIndex, fdiIndex });

        if (nameIndex === -1 || latIndex === -1 || lngIndex === -1) {
            throw new Error('Excel file must contain Name, Latitude, and Longitude columns');
        }

        // Process each data row
        for (let i = 1; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0) continue;

            const city = {
                name: this.cleanValue(row[nameIndex]),
                lat: parseFloat(row[latIndex]),
                lng: parseFloat(row[lngIndex])
            };

            // Skip if required fields are missing
            if (!city.name || isNaN(city.lat) || isNaN(city.lng)) {
                console.warn(`Skipping row ${i + 1}: missing required data`, row);
                continue;
            }

            // Add all other columns as additional data
            this.headers.forEach((header, index) => {
                if (index !== nameIndex && index !== latIndex && index !== lngIndex && header) {
                    const cleanHeader = this.cleanHeader(header);
                    const value = this.cleanValue(row[index]);
                    // Include all values, even null (we'll filter them out in display)
                    city[cleanHeader] = value;
                }
            });

            this.cities.push(city);
        }

        console.log(`Successfully parsed ${this.cities.length} cities from Excel file`);
        console.log('Sample city data:', this.cities[0]);
    }

    // Find column index by searching for header names (case insensitive)
    findColumnIndex(possibleNames) {
        for (let name of possibleNames) {
            const index = this.headers.findIndex(header => 
                header && header.toString().toLowerCase().includes(name.toLowerCase())
            );
            if (index !== -1) return index;
        }
        return -1;
    }

    // Clean header names for consistent property access
    cleanHeader(header) {
        if (!header) return '';
        return header.toString().trim();
    }

    // Clean cell values
    cleanValue(value) {
        if (value === null || value === undefined || value === '' || value === 'null') return null;
        
        // Handle NaN values
        if (typeof value === 'number' && isNaN(value)) return null;
        if (value === 'NaN' || value === 'nan') return null;
        
        const strValue = value.toString().trim();
        if (strValue === '' || strValue === 'null' || strValue === 'undefined') return null;
        
        // Try to parse as number if it looks like one
        const numValue = parseFloat(strValue);
        if (!isNaN(numValue) && isFinite(numValue)) {
            return numValue;
        }
        
        return strValue;
    }

    // Get cities data
    getCities() {
        return this.cities;
    }

    // Update a specific city's data
    updateCity(cityName, updates) {
        const city = this.cities.find(c => c.name === cityName);
        if (city) {
            Object.assign(city, updates);
            return true;
        }
        return false;
    }

    // Export current data as JSON
    exportAsJSON() {
        return JSON.stringify(this.cities, null, 2);
    }
}

// Global parser instance
window.excelParser = new ExcelParser();
