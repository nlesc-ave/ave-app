# Allelic Variation Explorer

[![Build Status](https://travis-ci.org/nlesc-ave/ave-app.svg?branch=master)](https://travis-ci.org/nlesc-ave/ave-app)
[![SonarCloud Gate](https://sonarcloud.io/api/badges/gate?key=nlesc-ave:ave-app)](https://sonarcloud.io/dashboard?id=nlesc-ave:ave-app)
[![SonarCloud Coverage](https://sonarcloud.io/api/badges/measure?key=nlesc-ave:ave-app&metric=coverage)](https://sonarcloud.io/component_measures/domain/Coverage?id=nlesc-ave:ave-app)
[![Download](https://api.bintray.com/packages/nlesc-ave/ave/ave-app/images/download.svg) ](https://bintray.com/nlesc-ave/ave/ave-app/_latestVersion)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app).

The web application uses [pileup.js](https://github.com/hammerlab/pileup.js).

## Develop

Requirements:

- caddy with http.cors plugin, https://caddyserver.com, static file server to proxy example api files

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

# Format

```
yarn prettier
```

Will format files in `src/`.

See https://github.com/prettier/prettier how to setup your editor.
