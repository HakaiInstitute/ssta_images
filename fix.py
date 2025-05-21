#!/usr/bin/env python3
"""
Fix JSON files with shortened date keys.
This script will convert keys like "250510" to "20250510".
"""

import json
import os
import re
import argparse
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('json_fix_script')

def fix_json_date_keys(filename):
    """Fix JSON file with shortened date keys."""
    try:
        logger.info(f"Processing file: {filename}")
        
        # Read the JSON file
        with open(filename, 'r') as f:
            data = json.load(f)
        
        # Create a new dictionary with fixed keys
        fixed_data = {}
        keys_fixed = 0
        
        for key, value in data.items():
            # Check if this is a shortened key (6 digits)
            if re.match(r'^\d{6}$', key):
                # This is a shortened key, prepend "20"
                new_key = "20" + key
                fixed_data[new_key] = value
                keys_fixed += 1
                logger.info(f"Fixed key: {key} -> {new_key}")
            else:
                # Keep the original key
                fixed_data[key] = value
        
        # Write the fixed data back to the file
        with open(filename, 'w') as f:
            json.dump(fixed_data, f, indent=4)
        
        logger.info(f"Fixed {keys_fixed} keys in {filename}")
        return keys_fixed
    
    except Exception as e:
        logger.error(f"Error fixing file {filename}: {str(e)}")
        return 0

def main():
    parser = argparse.ArgumentParser(description='Fix JSON files with shortened date keys.')
    parser.add_argument('files', nargs='+', help='JSON files to fix')
    args = parser.parse_args()
    
    total_fixed = 0
    for filename in args.files:
        if os.path.isfile(filename):
            total_fixed += fix_json_date_keys(filename)
        else:
            logger.error(f"File not found: {filename}")
    
    logger.info(f"Total keys fixed: {total_fixed}")

if __name__ == "__main__":
    main()