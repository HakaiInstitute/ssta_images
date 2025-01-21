# the json file this adds to is loaded directly from github to observable
from ftplib import FTP
import datetime
from dateutil.relativedelta import relativedelta
import xarray as xr
# import matplotlib.pyplot as plt
# import cmocean.cm as cm
import numpy as np
# import cartopy.crs as ccrs
import json 
import os

res = 1
img_extent = (-180, 180, -90, 90)

min_lon = -170
max_lon = -110

min_lat = 30

max_lat = 52




mmin_lon = -157
mmax_lon = 180
mmax_lat = 60
mmmin_lat = 52

# northern lats
# mmin_lat = 70

# download latest month
today = datetime.datetime.utcnow().date()
current_year = str(today.year)

last_month = today - relativedelta(months=1)
last_month = last_month.strftime("%Y%m")

ddir='./static/textures/'
ftp = FTP("ftp.star.nesdis.noaa.gov")
ftp.login()
ftp.cwd("pub/socd/mecb/crw/data/5km/v3.1_op/nc/v1.0/monthly/{current_year}")
fileAnomaly = "ct5km_ssta-mean_v3.1_{}.nc".format(last_month)

local_filename = ddir + fileAnomaly
with open(local_filename, 'wb') as f_output:
    ftp.retrbinary(f"RETR {fileAnomaly}", f_output.write)

ftp.close()

a = {}
def write_json(new_data, filename='./src/monthly.json'):
    with open(filename,'r+') as file:
          # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data.update(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.

        json.dump(file_data, file, indent = 4)
        
# sort files
# files = sorted(nc_files, key = last_4chars)  
# for file in files[0:1]:
#     print(file)
# local_filename = 'dataProcessing/ssta_monthly/ct5km_ssta-mean_v3.1_202012.nc'
# key = file[-9:-3]
# a.setdefault(key, [])
key = local_filename[-9:-3]
a.setdefault(key, [])
with xr.open_dataset(local_filename) as data:
    print(data.sea_surface_temperature_anomaly)
    dataDub = data
    dataDub2 = data
    mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon) #| ((data.lon >= mmin_lon) & (data.lon <= mmax_lon))
    mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
    mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= max_lon)
    mask_lat1 = (dataDub.lat >= mmmin_lat) & (dataDub.lat <= mmax_lat)
    mask_temp = (data.sea_surface_temperature_anomaly > -10) & (data.sea_surface_temperature_anomaly <10)
    
    data = data.where(mask_lon & mask_lat & mask_temp, drop=True)
    
    data1 = dataDub.where(mask_lon1 & mask_lat1 & mask_temp, drop=True)

    temp = data.sea_surface_temperature_anomaly.values[0,::res,::res]
    temp1 = data1.sea_surface_temperature_anomaly.values[0,::res,::res]
    totalTemp = np.concatenate((temp, temp1), axis=None)
    print((temp.size))
    print(totalTemp)
    Ta = (totalTemp[~np.isnan(totalTemp)].mean())
    a[key].append(float(Ta))
    write_json(a)
    os.remove(local_filename)


