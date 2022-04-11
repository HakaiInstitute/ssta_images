import datetime
import xarray as xr
import matplotlib.pyplot as plt
import cmocean.cm as cm
import numpy as np
import cartopy.crs as ccrs
import json 

res = 1
img_extent = (-180, 180, -90, 90)

min_lon = -170
max_lon = -110

min_lat = 30

max_lat = 52



# antimeridian fix
mmin_lon = -157
mmax_lon = 180
mmax_lat = 60
mmmin_lat = 52

# northern lats
# mmin_lat = 70
a = {}
def write_json(new_data, filename='monthly.json'):
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
def last_4chars(x):
    return(x[-10:])

# files = sorted(nc_files, key = last_4chars)  
# for file in files[0:1]:
#     print(file)
file = 'ssta_monthly/ct5km_ssta-mean_v3.1_202203.nc'
key = file[-9:-3]
a.setdefault(key, [])

with xr.open_dataset(file) as data:
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