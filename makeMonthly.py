from ftplib import FTP
import datetime
from dateutil.relativedelta import relativedelta
import xarray as xr
import numpy as np
import json
import os
import logging
import warnings
import re
import socket

# Suppress the type cast warning
warnings.filterwarnings("ignore", message="invalid value encountered in cast")

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('monthly_script')

def extract_full_date_key(filename):
    """
    Extract the full 8-digit date key (YYYYMMDD) from a filename.
    Works with various filename patterns by attempting different strategies.
    """
    # Get just the filename without the path
    base_filename = os.path.basename(filename)
    
    # Try different patterns
    # Pattern for filenames like: noaa-crw_mhw_v1.0.1_category_20250510.nc
    match = re.search(r'_(\d{8})\.nc$', base_filename)
    if match:
        return match.group(1)
    
    # Pattern for filenames like: ct5km_ssta-mean_v3.1_202504.nc
    match = re.search(r'_(\d{6})\.nc$', base_filename)
    if match:
        date_str = match.group(1)
        # Ensure it has the full year (YYYY)
        if date_str.startswith('20') or date_str.startswith('19'):
            return date_str
        else:
            # If it's just YYMMDD, prepend 20 for years 21st century
            return "20" + date_str
    
    # Fallback: Extract from last positions in filename
    # Check if we're dealing with a shortened key (YYMMDD)
    if len(base_filename) >= 9:
        short_key = base_filename[-9:-3]  # This would extract YYMMDD
        if short_key.isdigit() and len(short_key) == 6:
            # Add century prefix for 21st century dates
            return "20" + short_key
    
    # Last resort: return whatever was there before
    if len(base_filename) >= 11:
        return base_filename[-11:-3]  # This would try to extract YYYYMMDD
    
    # If all else fails, log an error and return a fallback
    logger.error(f"Could not extract date from filename: {filename}")
    return "00000000"  # Obviously invalid date to make it clear there was an error

def connect_to_ftp_with_retry(host, max_retries=3, delay_seconds=5):
    """Connect to FTP with retry logic."""
    retries = 0
    while retries < max_retries:
        try:
            logger.info(f"Connecting to FTP server {host} (attempt {retries+1})")
            ftp = FTP(host, timeout=30)  # Add timeout to prevent hanging
            ftp.login()
            logger.info(f"Successfully connected to {host}")
            return ftp
        except Exception as e:
            logger.error(f"FTP connection attempt {retries+1} failed: {str(e)}")
            retries += 1
            if retries < max_retries:
                wait_time = delay_seconds * (2 ** retries)  # Exponential backoff
                logger.info(f"Waiting {wait_time} seconds before retry...")
                time.sleep(wait_time)
    
    logger.error(f"All connection attempts to {host} failed")
    return None

def write_json(new_data, filename='./src/monthly.json'):
    """Write JSON data to file."""
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        # Check if file exists
        if not os.path.isfile(filename):
            with open(filename, 'w') as file:
                json.dump({}, file)
        
        with open(filename, 'r+') as file:
            try:
                file_data = json.load(file)
            except json.JSONDecodeError:
                # If the file is empty or has invalid JSON
                file_data = {}
            
            # Update the data
            file_data.update(new_data)
            
            # Reset file position and write updated data
            file.seek(0)
            file.truncate()
            json.dump(file_data, file, indent=4)
            
        logger.info(f"Successfully wrote data to {filename}")
        
    except Exception as e:
        logger.error(f"Error writing JSON to {filename}: {str(e)}")

# Configuration
res = 1
img_extent = (-180, 180, -90, 90)
min_lon, max_lon = -170, -110
min_lat, max_lat = 30, 52
mmin_lon, mmax_lon = -157, 180
mmax_lat, mmmin_lat = 60, 52

# Get dates
today = datetime.datetime.utcnow().date()
current_year = str(today.year)
logger.info(f"Current year: {current_year}")

last_month = today - relativedelta(months=1)
last_month_str = last_month.strftime("%Y%m")
logger.info(f"Processing data for: {last_month_str}")

# Set directory and ensure it exists
ddir = './static/textures/'
os.makedirs(ddir, exist_ok=True)

try:
    # Connect to FTP
    ftp = connect_to_ftp_with_retry("ftp.star.nesdis.noaa.gov")
    
    if ftp:
        try:
            # Use f-string to properly interpolate the current_year variable
            ftp_dir = f"pub/socd/mecb/crw/data/5km/v3.1_op/nc/v1.0/monthly/{current_year}"
            logger.info(f"Changing to directory: {ftp_dir}")
            ftp.cwd(ftp_dir)
            
            # Set up file names
            fileAnomaly = f"ct5km_ssta-mean_v3.1_{last_month_str}.nc"
            local_filename = os.path.join(ddir, fileAnomaly)
            
            # Download the file
            logger.info(f"Downloading file: {fileAnomaly}")
            with open(local_filename, 'wb') as f_output:
                ftp.retrbinary(f"RETR {fileAnomaly}", f_output.write)
            
            logger.info("Closing FTP connection")
            ftp.quit()
            
            # Initialize dictionary for data
            a = {}
            
            # Process the NetCDF file
            logger.info(f"Processing file: {local_filename}")
            
            # Use the extract_full_date_key function to get the proper full-date key
            key = extract_full_date_key(local_filename)
            logger.info(f"Using key: {key} for {local_filename}")
            
            a.setdefault(key, [])
            
            with xr.open_dataset(local_filename, engine='netcdf4') as data:
                logger.info("Dataset opened successfully")
                
                dataDub = data
                dataDub2 = data
                
                # Create masks
                mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon)
                mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
                mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= max_lon)
                mask_lat1 = (dataDub.lat >= mmmin_lat) & (dataDub.lat <= mmax_lat)
                mask_temp = (data.sea_surface_temperature_anomaly > -10) & (data.sea_surface_temperature_anomaly < 10)
                
                # Apply masks
                data_filtered = data.where(mask_lon & mask_lat & mask_temp, drop=True)
                data1 = dataDub.where(mask_lon1 & mask_lat1 & mask_temp, drop=True)
                
                # Get temperature data
                temp = data_filtered.sea_surface_temperature_anomaly.values[0,::res,::res]
                temp1 = data1.sea_surface_temperature_anomaly.values[0,::res,::res]
                
                # Combine data and calculate mean
                totalTemp = np.concatenate((temp, temp1), axis=None)
                logger.info(f"Total data points: {temp.size}")
                
                # Calculate mean, ignoring NaN values
                Ta = float(totalTemp[~np.isnan(totalTemp)].mean())
                logger.info(f"Mean temperature anomaly: {Ta}")
                
                # Add to dictionary and write to JSON
                a[key].append(Ta)
                write_json(a)
                
            # Clean up - remove the downloaded file
            os.remove(local_filename)
            logger.info(f"Removed downloaded file: {local_filename}")
            
            logger.info("Processing completed successfully")
            
        except Exception as e:
            logger.error(f"Error processing data: {str(e)}")
            
            # Try to close FTP connection if it's open
            try:
                ftp.quit()
            except:
                pass
    
except Exception as e:
    logger.error(f"Error: {str(e)}")