# Allelic Variation Explorer

[![Build Status](https://travis-ci.org/nlesc-ave/ave-app.svg?branch=master)](https://travis-ci.org/nlesc-ave/ave-app)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3ccb04ea47b04d19bfb560ffba27d18b)](https://www.codacy.com/app/nlesc-ave/ave-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nlesc-ave/ave-app&amp;utm_campaign=Badge_Grade)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/3ccb04ea47b04d19bfb560ffba27d18b)](https://www.codacy.com/app/nlesc-ave/ave-app?utm_source=github.com&utm_medium=referral&utm_content=nlesc-ave/ave-app&utm_campaign=Badge_Coverage)
[![Download](https://api.bintray.com/packages/nlesc-ave/ave/ave-app/images/download.svg) ](https://bintray.com/nlesc-ave/ave/ave-app/_latestVersion)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app).

The web application uses [pileup.js](https://github.com/hammerlab/pileup.js).

## Develop

Requirements:

- caddy with http.cors plugin, https://caddyserver.com, static file server to proxy example api files
- electron build dependencies, to build multi platform distributions, see [here](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) for more info

Clone repo and then
```
yarn install
```

Download example 2bit and bed file from http://bioviz.org/quickload/S_lycopersicum_May_2012/
```
cd api/genomes/SL.2.40/
wget http://bioviz.org/quickload/S_lycopersicum_May_2012/S_lycopersicum_May_2012.2bit \
http://bioviz.org/quickload/S_lycopersicum_May_2012/S_lycopersicum_May_2012.bed.gz \
http://bioviz.org/quickload/S_lycopersicum_May_2012/genome.txt
wget http://hgdownload.cse.ucsc.edu/admin/exe/linux.x86_64.v287/bedToBigBed
# the version for mac os is available also available http://hgdownload.cse.ucsc.edu/admin/exe/macOSX.x86_64/bedToBigBed
chmod +x bedToBigBed
# description field is too long for bedToBigBed so it must be trimmed
gunzip -c S_lycopersicum_May_2012.bed.gz | perl -n -e 'chomp;@F=split(/\t/);$F[13] = substr($F[13],0,255); print join("\t", @F),"\n";'  > S_lycopersicum_May_2012.bed.trimmed
./bedToBigBed -tab -type=bed12+2 S_lycopersicum_May_2012.bed.trimmed genome.txt S_lycopersicum_May_2012.bb
rm S_lycopersicum_May_2012.bed.gz S_lycopersicum_May_2012.bed.trimmed genome.txt bedToBigBed
cd -
```

Start development server
```
yarn start
```

This will open the web application in a web browser on `http://localhost:3000`.
It will also start an api web service using caddy with example api files.

## Develop with electron

```
yarn electron-dev
```
This will start an electron application with the application running in develop mode.

To load the example api files, the api root must be changed to `http://localhost:3000/api` in the settings page.

## Build electron distributions

To build Linux and Windows distributions in the `dist/` directory use:
```
yarn electron-pack
```

On MacOS a dmg file can be built with:
```
yarn electron-pack-mac
```

After installation, set api root to location of a running ave api service.