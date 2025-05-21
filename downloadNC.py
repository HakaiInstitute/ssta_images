from ftplib import FTP
import datetime
import xarray as xr
import matplotlib.pyplot as plt
import cmocean.cm as cm
import numpy as np
import cartopy.crs as ccrs
import os
import json 
import matplotlib.colors
import time
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
logger = logging.getLogger('download_script')

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
    
    # Pattern for filenames with date at the end: something_202505.nc
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

def write_json(new_data, filename='./src/monthlyMHW.json'):
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

## Get the data from ftp sites
today = datetime.datetime.utcnow().date()
current_year = str(today.year)
logger.info(f"Current year: {current_year}")

ddir = './static/textures/'
os.makedirs(ddir, exist_ok=True)  # Ensure directory exists

# Try to download SSTA data
try:
    logger.info("Starting SSTA data download")
    ftp = connect_to_ftp_with_retry("ftp.star.nesdis.noaa.gov")
    
    if ftp:
        try:
            ftp.cwd(f"pub/socd/mecb/crw/data/5km/v3.1_op/nc/v1.0/daily/ssta/{current_year}")
            
            for d in range(2, 14):
                yesterday = today - datetime.timedelta(days=d)
                yesterday_str = yesterday.strftime("%Y%m%d")
                fileAnomaly = f"ct5km_ssta_v3.1_{yesterday_str}.nc"
                logger.info(f"Attempting to download {fileAnomaly}")
                local_filename = ddir + fileAnomaly
                try:
                    with open(local_filename, 'wb') as f_output:
                        ftp.retrbinary(f"RETR {fileAnomaly}", f_output.write)
                    logger.info(f"Successfully downloaded {fileAnomaly}")
                except Exception as e:
                    logger.error(f"Failed to download {fileAnomaly}: {str(e)}")
                    logger.warning("Data not available")
            
            ftp.quit()  # Important: properly close the connection
            
            # Process the SSTA files
            get_latlong = True
            res = 1
            img_extent = (-180, 180, -90, 90)
            min_lon, max_lon = -180, -50
            min_lat, max_lat = -25, 90
            mmin_lon, mmax_lon = 130, 180
            mmin_lat = 70

            for d in range(2, 14):
                yesterday = today - datetime.timedelta(days=d)
                yesterday_str = yesterday.strftime("%Y%m%d")
                fileAnomaly = f"ct5km_ssta_v3.1_{yesterday_str}.nc"
                local_filename = ddir + fileAnomaly
                
                if not os.path.exists(local_filename):
                    logger.warning(f"File {local_filename} does not exist, skipping processing")
                    continue
                
                try:
                    with xr.open_dataset(local_filename, engine='netcdf4') as data:
                        dataDub = data
                        dataDub2 = data
                        mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon)
                        mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
                        mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= mmax_lon)
                        mask_lat1 = (dataDub2.lat >= mmin_lat) & (dataDub2.lat <= max_lat)
                        
                        data_filtered = data.where(mask_lon & mask_lat, drop=True)
                        data1 = dataDub.where(mask_lon1 & mask_lat, drop=True)
                        data2 = dataDub2.where(mask_lat1, drop=True)
                        
                        temp = data_filtered.sea_surface_temperature_anomaly.values[0,::res,::res]
                        temp1 = data1.sea_surface_temperature_anomaly.values[0,::res,::res]
                        temp2 = data2.sea_surface_temperature_anomaly.values[0,::res,::res]
                        
                        lon = np.ma.masked_outside(data_filtered.lon.values[::res], -180, 180)
                        lat = np.ma.masked_outside(data_filtered.lat.values[::res], -90, 90)
                        lon1 = np.ma.masked_outside(data1.lon.values[::res], -180, 180)
                        lat1 = np.ma.masked_outside(data1.lat.values[::res], -90, 90)
                        lon2 = np.ma.masked_outside(data2.lon.values[::res], -180, 180)
                        lat2 = np.ma.masked_outside(data2.lat.values[::res], -90, 90)
                        
                        fig = plt    
                        ax = fig.axes(projection=ccrs.PlateCarree())
                        
                        fig.axis('off')
                        fig.margins(0,0)
                        fig.gca().xaxis.set_major_locator(plt.NullLocator())
                        fig.gca().yaxis.set_major_locator(plt.NullLocator())
                        fig.tick_params(axis='both', left='False', top='False', right='False', bottom='False', 
                                        labelleft='False', labeltop='False', labelright='False', labelbottom='False')
                        
                        fig.pcolormesh(lon, lat, temp, vmin=-4, vmax=4, cmap=cm.balance)
                        fig.pcolormesh(lon1, lat1, temp1, vmin=-4, vmax=4, cmap=cm.balance)
                        fig.pcolormesh(lon2, lat2, temp2, vmin=-4, vmax=4, cmap=cm.balance)
                        
                        ax.set_extent([-180, 180, -90, 90])
                        
                        fig.savefig(ddir+fileAnomaly[:-3]+'.png', transparent=True, dpi=200, 
                                    bbox_inches='tight', pad_inches=0)
                        
                        os.remove(ddir+fileAnomaly)
                        data.close()
                        fig.clf()
                        plt.close()
                        logger.info(f"Successfully processed {fileAnomaly}")
                except Exception as e:
                    logger.error(f"Error processing {fileAnomaly}: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error in SSTA data processing: {str(e)}")
            if ftp:
                try:
                    ftp.quit()  # Make sure to close the connection even on error
                except:
                    pass
    
except Exception as e:
    logger.error(f"SSTA data error: {str(e)}")
    logger.error("SSTA data not available")

# Try to download MHW Category data with a new FTP connection
try:
    logger.info("Starting MHW data download")
    # Create a fresh FTP connection - this is crucial
    ftp = connect_to_ftp_with_retry("ftp.star.nesdis.noaa.gov")
    
    if ftp:
        try:
            ftp.cwd(f"pub/socd/mecb/crw/data/marine_heatwave/v1.0.1/category/nc/{current_year}")
            
            for d in range(2, 14):
                yesterday = today - datetime.timedelta(days=d)
                yesterday_str = yesterday.strftime("%Y%m%d")
                fileHW = f"noaa-crw_mhw_v1.0.1_category_{yesterday_str}.nc"
                local_filename = ddir + fileHW
                logger.info(f"Attempting to download {fileHW}")
                
                try:
                    with open(local_filename, 'wb') as f_output:
                        ftp.retrbinary(f"RETR {fileHW}", f_output.write)
                    logger.info(f"Successfully downloaded {fileHW}")
                except Exception as e:
                    logger.error(f"Failed to download {fileHW}: {str(e)}")
                    logger.warning("Data not available")
            
            ftp.quit()  # Important: properly close the connection
            
            # Process the MHW files
            a = {}
            
            for d in range(2, 14):
                yesterday = today - datetime.timedelta(days=d)
                yesterday_str = yesterday.strftime("%Y%m%d")
                fileHW = f"noaa-crw_mhw_v1.0.1_category_{yesterday_str}.nc"
                local_filename = ddir + fileHW
                
                if not os.path.exists(local_filename):
                    logger.warning(f"File {local_filename} does not exist, skipping processing")
                    continue
                
                try:
                    with xr.open_dataset(local_filename, engine='netcdf4') as data:
                        min_lon, max_lon = -180, -50
                        min_lat, max_lat = -25, 90
                        mmin_lon, mmax_lon = 130, 180
                        mmin_lat = 70
                        
                        # Use the extract_full_date_key function to get the proper full-date key
                        key = extract_full_date_key(local_filename)
                        logger.info(f"Using key: {key} for {local_filename}")
                        
                        a.setdefault(key, [])
                        
                        dataDub = data
                        dataDub2 = data
                        
                        mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon)
                        mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
                        mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= mmax_lon)
                        mask_lat1 = (dataDub2.lat >= mmin_lat) & (dataDub2.lat <= max_lat)
                        
                        data_filtered = data.where(mask_lon & mask_lat, drop=True)
                        data1 = dataDub.where(mask_lon1 & mask_lat, drop=True)
                        data2 = dataDub2.where(mask_lat1, drop=True)
                        
                        temp = np.ma.masked_outside(data_filtered.heatwave_category.values[0,::res,::res], -1, 5)
                        temp1 = np.ma.masked_outside(data1.heatwave_category.values[0,::res,::res], -1, 5)
                        temp2 = np.ma.masked_outside(data2.heatwave_category.values[0,::res,::res], -1, 5)
                        
                        lon = np.ma.masked_outside(data_filtered.lon.values[::res], -180, 180)
                        lat = np.ma.masked_outside(data_filtered.lat.values[::res], -90, 90)
                        lon1 = np.ma.masked_outside(data1.lon.values[::res], -180, 180)
                        lat1 = np.ma.masked_outside(data1.lat.values[::res], -90, 90)
                        lon2 = np.ma.masked_outside(data2.lon.values[::res], -180, 180)
                        lat2 = np.ma.masked_outside(data2.lat.values[::res], -90, 90)
                        
                        fig = plt    
                        ax = fig.axes(projection=ccrs.PlateCarree())
                        
                        fig.axis('off')
                        fig.margins(0,0)
                        fig.gca().xaxis.set_major_locator(plt.NullLocator())
                        fig.gca().yaxis.set_major_locator(plt.NullLocator())
                        fig.tick_params(axis='both', left='False', top='False', right='False', bottom='False', 
                                        labelleft='False', labeltop='False', labelright='False', labelbottom='False')
                        
                        norm = plt.Normalize(-2, 5)
                        cmap = matplotlib.colors.ListedColormap(["white", "lightblue", "#FEDB67", "#f26722", "#cd3728", "#7E1416"])
                        
                        fig.pcolormesh(lon, lat, temp, vmin=-2, vmax=5, cmap=cmap)
                        fig.pcolormesh(lon1, lat1, temp1, vmin=-2, vmax=5, cmap=cmap)
                        fig.pcolormesh(lon2, lat2, temp2, vmin=-2, vmax=5, cmap=cmap)
                        
                        ax.set_extent([-180, 180, -90, 90])
                        
                        fig.savefig(ddir+fileHW[:-3]+'.png', transparent=True, dpi=300, 
                                    bbox_inches='tight', pad_inches=0)
                        
                        # Calculate time series data
                        min_lon, max_lon = -170, -110
                        min_lat, max_lat = 30, 52
                        mmin_lon, mmax_lon = -157, 180
                        mmax_lat, mmmin_lat = 60, 52
                        
                        dataDub = data  # Reset data
                        mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon)
                        mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
                        mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= max_lon)
                        mask_lat1 = (dataDub.lat >= mmmin_lat) & (dataDub.lat <= mmax_lat)
                        mask_lat2 = (dataDub.lat >= min_lat) & (dataDub.lat <= max_lat)
                        
                        data0 = data.where(mask_lon & mask_lat, drop=True)
                        data1 = dataDub.where(mask_lon1 & mask_lat, drop=True)
                        
                        t0 = np.count_nonzero(data0.heatwave_category == 0) + np.count_nonzero(data1.heatwave_category == 0)
                        t1 = np.count_nonzero(data0.heatwave_category == 1) + np.count_nonzero(data1.heatwave_category == 1)
                        t2 = np.count_nonzero(data0.heatwave_category == 2) + np.count_nonzero(data1.heatwave_category == 2)
                        t3 = np.count_nonzero(data0.heatwave_category == 3) + np.count_nonzero(data1.heatwave_category == 3)
                        t4 = np.count_nonzero(data0.heatwave_category == 4) + np.count_nonzero(data1.heatwave_category == 4)
                        
                        a[key].append(t0)
                        a[key].append(t1)
                        a[key].append(t2)
                        a[key].append(t3)
                        a[key].append(t4)
                        
                        # Write JSON data
                        write_json(a)
                        
                        # Clean up
                        os.remove(ddir+fileHW)
                        data.close()
                        fig.clf()
                        plt.close()
                        logger.info(f"Successfully processed {fileHW}")
                        
                except Exception as e:
                    logger.error(f"Error processing {fileHW}: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error in MHW data processing: {str(e)}")
            if ftp:
                try:
                    ftp.quit()  # Make sure to close the connection even on error
                except:
                    pass
    
except Exception as e:
    logger.error(f"MHW data error: {str(e)}")
    logger.error("MHW data not available")

logger.info("Script completed")