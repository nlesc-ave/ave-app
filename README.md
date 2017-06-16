# Allelic Variation Explorer

[![Build Status](https://travis-ci.org/nlesc-ave/ave-app.svg?branch=master)](https://travis-ci.org/nlesc-ave/ave-app)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3ccb04ea47b04d19bfb560ffba27d18b)](https://www.codacy.com/app/nlesc-ave/ave-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nlesc-ave/ave-app&amp;utm_campaign=Badge_Grade)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app).

The web application uses [pileup.js](https://github.com/hammerlab/pileup.js).

## Develop

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

Start static file server (https://caddyserver.com) to proxy example api files.
```
caddy
```

Start development server
```
yarn start
```
