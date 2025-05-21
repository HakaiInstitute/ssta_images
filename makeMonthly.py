from ftplib import FTP
import datetime
from dateutil.relativedelta import relativedelta
import xarray as xr
import numpy as np
import json
import os
import logging
import warnings

# Suppress the type cast warning
warnings.filterwarnings("ignore", message="invalid value encountered in cast")

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('monthly_script')

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

# Set up FTP connection
try:
    logger.info("Connecting to FTP server...")
    ftp = FTP("ftp.star.nesdis.noaa.gov", timeout=30)
    ftp.login()
    
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
    
    # Define function to write JSON
    def write_json(new_data, filename='./src/monthly.json'):
        try:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            
            # Check if file exists, create it if it doesn't
            if not os.path.isfile(filename):
                with open(filename, 'w') as file:
                    json.dump({}, file)
            
            with open(filename, 'r+') as file:
                try:
                    file_data = json.load(file)
                except json.JSONDecodeError:
                    file_data = {}
                
                # Update with new data
                file_data.update(new_data)
                
                # Write back to file
                file.seek(0)
                file.truncate()
                json.dump(file_data, file, indent=4)
                
            logger.info(f"Successfully wrote data to {filename}")
        except Exception as e:
            logger.error(f"Error writing JSON: {str(e)}")
    
    # Process the NetCDF file
    logger.info(f"Processing file: {local_filename}")
    key = local_filename[-9:-3]
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
    logger.error(f"Error: {str(e)}")
    
    # Try to close FTP connection if it's open
    try:
        ftp.quit()
    except:
        pass