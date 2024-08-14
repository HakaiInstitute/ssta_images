# Marine heatwave monitor

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## To deploy

test site
- to deploy to the staging repo [repo](https://github.com/HakaiInstitute/ssta_images_staging) from the gh-pages branch.

git push staging

To deploy to production (from gh-pages branch)

git push

## Visualizations
Most of the visualization elements, as well as the date player are in his observable [notebook](https://observablehq.com/d/0b936d79280ee3bd).

When updates are made to the notebook they can be embedded in the site using these commands

curl -o bs.tgz "https://api.observablehq.com/d/0b936d79280ee3bd.tgz?v=3"

tar -C src/buoyviz -xvzf bs.tgz

## Data
The buoy data is loaded directly in the observable notebook via api. 

The images are created in a github action which downloads and processes netcdf files from NOAA. The dxadatata is updated daily so the action runs daily to include yesterday's data. It is not uncommon for the NOAA data not to be updated for a few days, especially the MHW category data. Currently the python script only looks for yesterday's files but it could be improved to look for any recent days where there wasn't data available. 
