#!/usr/bin/env python3
"""
Excel to JSON Converter
Converts data.xlsx to data.json for web deployment
"""

import json
import sys
import os

try:
    import pandas as pd
except ImportError:
    print("pandas not found. Installing...")
    os.system("pip install pandas openpyxl")
    import pandas as pd

def convert_excel_to_json(excel_file="data.xlsx", json_file="data.json"):
    """Convert Excel file to JSON format"""
    
    if not os.path.exists(excel_file):
        print(f"Error: {excel_file} not found in current directory")
        return False
    
    try:
        # Read Excel file
        print(f"Reading {excel_file}...")
        df = pd.read_excel(excel_file, header=None)
        
        # Convert to list of lists (same format as XLSX.js)
        data = df.values.tolist()
        
        # Write to JSON file
        print(f"Writing to {json_file}...")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Successfully converted {excel_file} to {json_file}")
        print(f"📊 Total rows: {len(data)}")
        
        # Show first few rows for verification
        if len(data) > 0:
            print("\n📋 First few rows:")
            for i, row in enumerate(data[:3]):
                print(f"   Row {i+1}: {row[:5]}{'...' if len(row) > 5 else ''}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting file: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Excel to JSON Converter")
    print("=" * 30)
    
    # Check if custom files are specified
    excel_file = sys.argv[1] if len(sys.argv) > 1 else "data.xlsx"
    json_file = sys.argv[2] if len(sys.argv) > 2 else "data.json"
    
    success = convert_excel_to_json(excel_file, json_file)
    
    if success:
        print(f"\n🎉 Done! You can now use {json_file} in your web application.")
        print("💡 Deploy this JSON file along with your other files to Netlify.")
    else:
        print("\n❌ Conversion failed. Please check the error message above.")
        sys.exit(1)
