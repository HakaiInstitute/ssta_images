from ftplib import FTP
from pathlib import Path
import datetime
import xarray as xr
import matplotlib.pyplot as plt
import cmocean.cm as cm
import numpy as np
import cartopy.crs as ccrs

# import cartopy.feature as cfeature
# import cartopy.io.img_tiles as cimgt
import glob

## Get the data from ftp sites

# ftp://ftp.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/5km/v3.1_op/nc/v1.0/daily/ssta/
today = datetime.datetime.utcnow().date()

yesterday = today - datetime.timedelta(days=1)
yesterday = yesterday.strftime("%Y%m%d")
ddir='./static/textures/'

ftp = FTP("ftp.star.nesdis.noaa.gov")
ftp.login()
ftp.cwd("pub/sod/mecb/crw/data/5km/v3.1_op/nc/v1.0/daily/ssta/2022")
fileAnomaly = "ct5km_ssta_v3.1_{}.nc".format(yesterday)
# script_path = Path(__file__).parent
# print(script_path)
local_filename = ddir + fileAnomaly
with open(local_filename, 'wb') as f_output:
    ftp.retrbinary(f"RETR {fileAnomaly}", f_output.write)
    # ftp.retrbinary('RETR '+ filename, f_output.write)
# ftp.retrbinary(f"RETR {fileAnomaly}", open(rf"{fileAnomaly}", "wb").write)
ftp.close()


get_latlong = True
res = 1

img_extent = (-180, 180, -90, 90)

min_lon = -180
max_lon = -50

min_lat = -25

max_lat = 90



# antimeridian fix
mmin_lon = 130
mmax_lon = 180

# northern lats
mmin_lat = 70

# sort files
def last_4chars(x):
    return(x[-10:])

# files = sorted(nc_files, key = last_4chars)  
# for file in files[0:2]:

with xr.open_dataset(fileAnomaly) as data:
    dataDub = data
    dataDub2 = data
    mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon) #| ((data.lon >= mmin_lon) & (data.lon <= mmax_lon))
    mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
    mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= mmax_lon)
    mask_lat1 = (dataDub2.lat >= mmin_lat) & (dataDub2.lat <= max_lat)
    
    data = data.where(mask_lon & mask_lat, drop=True)
    
    data1 = dataDub.where(mask_lon1 & mask_lat, drop=True)
    
    data2 = dataDub2.where(mask_lat1, drop=True)
#         print(data1)
#         print(data2)
        
    #ax = plt.axes(projection=ccrs.PlateCarree())
    # ax.coastlines()
    temp = data.sea_surface_temperature_anomaly.values[0,::res,::res]
    temp1 = data1.sea_surface_temperature_anomaly.values[0,::res,::res]
    temp2 = data2.sea_surface_temperature_anomaly.values[0,::res,::res]
#         print(temp2)
#         if get_latlong : 
    lon = np.ma.masked_outside(data.lon.values[::res],  -180, 180)
    lat = np.ma.masked_outside(data.lat.values[::res],  -90, 90)
    lon1 = np.ma.masked_outside(data1.lon.values[::res],  -180, 180)
    lat1 = np.ma.masked_outside(data1.lat.values[::res],  -90, 90)
    lon2 = np.ma.masked_outside(data2.lon.values[::res],  -180, 180)
    lat2 = np.ma.masked_outside(data2.lat.values[::res],  -90, 90)
#             topo = np.ma.masked_outside(dataElev.variables['elevation'],0.1,5000)
#             lats = dataElev.variables['latitude'][:]
#             lons = dataElev.variables['longitude'][:]
#             get_latlong = False
    fig = plt    
    ax = fig.axes(projection=ccrs.PlateCarree())


    fig.axis('off')
    fig.margins(0,0)
    fig.gca().xaxis.set_major_locator(plt.NullLocator())
    fig.gca().yaxis.set_major_locator(plt.NullLocator())
    fig.tick_params(axis='both', left='False', top='False', right='False', bottom='False', labelleft='False', labeltop='False', labelright='False', labelbottom='False')
    # ax.stock_img()
    
    
#         fig.pcolormesh(lons, lats, topo,vmin=0.1,vmax=10000,cmap='gray')
    fig.pcolormesh(lon, lat, temp, vmin=-4, vmax=4,cmap=cm.balance)
    fig.pcolormesh(lon1, lat1, temp1, vmin=-4, vmax=4,cmap=cm.balance)
    fig.pcolormesh(lon2, lat2, temp2, vmin=-4, vmax=4,cmap=cm.balance)
#         ax.add_feature(cfeature.LAND,color='grey')
#         ax.set_facecolor([0.0, 1.0, 0.0, 0])
#         ax.imshow(img,extent=img_extent)
    ax.set_extent([-180, 180, -90, 90])
    

    fig.savefig(fileAnomaly[:-3]+'.png',transparent=True, dpi=200,bbox_inches='tight', pad_inches = 0)
#         plt.close("all")
    data.close()
    fig.clf()
    plt.close()

# ftp.retrbinary(f'RETR {fileAnomaly}', open(str(Path(r'/Users/mathewbrown/Projects/mhw_images/ssta/dataProcessing') / fileAnomaly), 'wb').write)

# MHW Category
# ftp://ftp.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/marine_heatwave/v1.0.1/category/nc/


ftp = FTP("ftp.star.nesdis.noaa.gov")
ftp.login()
ftp.cwd("pub/sod/mecb/crw/data/marine_heatwave/v1.0.1/category/nc/2022")
fileHW = "noaa-crw_mhw_v1.0.1_category_{}.nc".format(yesterday)
script_path = Path(__file__).parent
print(script_path)
local_filename = ddir + fileHW
with open(local_filename, 'wb') as f_output:
    ftp.retrbinary(f"RETR {fileHW}", f_output.write)
# ftp.retrbinary(f"RETR {fileHW}", open(rf"{fileHW}", "wb").write)
ftp.close()


import matplotlib.colors

with xr.open_dataset(fileHW) as data:

    dataDub = data
    dataDub2 = data
    mask_lon = (data.lon >= min_lon) & (data.lon <= max_lon) #| ((data.lon >= mmin_lon) & (data.lon <= mmax_lon))
    mask_lat = (data.lat >= min_lat) & (data.lat <= max_lat)
    mask_lon1 = (dataDub.lon >= mmin_lon) & (dataDub.lon <= mmax_lon)
    mask_lat1 = (dataDub2.lat >= mmin_lat) & (dataDub2.lat <= max_lat)

    data = data.where(mask_lon & mask_lat, drop=True)

    data1 = dataDub.where(mask_lon1 & mask_lat, drop=True)

    data2 = dataDub2.where(mask_lat1, drop=True)

    temp = np.ma.masked_outside(data.heatwave_category.values[0,::res,::res],-1,5)
    temp1 = np.ma.masked_outside(data1.heatwave_category.values[0,::res,::res],-1,5)
    temp2 = np.ma.masked_outside(data2.heatwave_category.values[0,::res,::res],-1,5)
    tempV = data.variables['heatwave_category'][:,:,:]


    lon = np.ma.masked_outside(data.lon.values[::res],  -180, 180)
    lat = np.ma.masked_outside(data.lat.values[::res],  -90, 90)
    lon1 = np.ma.masked_outside(data1.lon.values[::res],  -180, 180)
    lat1 = np.ma.masked_outside(data1.lat.values[::res],  -90, 90)
    lon2 = np.ma.masked_outside(data2.lon.values[::res],  -180, 180)
    lat2 = np.ma.masked_outside(data2.lat.values[::res],  -90, 90)

        
    fig = plt    
    ax = fig.axes(projection=ccrs.PlateCarree())


    fig.axis('off')
    fig.margins(0,0)
    fig.gca().xaxis.set_major_locator(plt.NullLocator())
    fig.gca().yaxis.set_major_locator(plt.NullLocator())
    fig.tick_params(axis='both', left='False', top='False', right='False', bottom='False', labelleft='False', labeltop='False', labelright='False', labelbottom='False')
    # ax.stock_img()
    norm=plt.Normalize(-2,5)
    cmap = matplotlib.colors.ListedColormap(["white","lightblue","#FEDB67", "#f26722", "#cd3728", "#7E1416"])


    fig.pcolormesh(lon, lat, temp, vmin=-2, vmax=5,cmap=cmap)
    fig.pcolormesh(lon1, lat1, temp1, vmin=-2, vmax=5,cmap=cmap)
    fig.pcolormesh(lon2, lat2, temp2, vmin=-2, vmax=5,cmap=cmap)
    ax.set_extent([-180, 180, -90, 90])


    fig.savefig(fileHW[:-3]+'.png',transparent=True, dpi=300,bbox_inches='tight', pad_inches = 0)
#         plt.close("all")
    data.close()
    fig.clf()
    plt.close()
    
## Create the images
# import xarray as xr
# import matplotlib.pyplot as plt
# import cmocean.cm as cm
# import numpy as np
# import cartopy.crs as ccrs
# # import cartopy.feature as cfeature
# import cartopy.io.img_tiles as cimgt
# import glob
