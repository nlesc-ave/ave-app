# Allelic Variation Explorer

[![Build Status](https://travis-ci.org/nlesc-ave/ave-app.svg?branch=master)](https://travis-ci.org/nlesc-ave/ave-app)
[![SonarCloud Gate](https://sonarcloud.io/api/badges/gate?key=nlesc-ave:ave-app)](https://sonarcloud.io/dashboard?id=nlesc-ave:ave-app)
[![SonarCloud Coverage](https://sonarcloud.io/api/badges/measure?key=nlesc-ave:ave-app&metric=coverage)](https://sonarcloud.io/component_measures/domain/Coverage?id=nlesc-ave:ave-app)
[![Download](https://api.bintray.com/packages/nlesc-ave/ave/ave-app/images/download.svg) ](https://bintray.com/nlesc-ave/ave/ave-app/_latestVersion#files)

The Allelic Variation Explorer web application visualizes clusters of genomic variants.

![Screenshot of Allelic Variation Explorer](https://github.com/nlesc-ave/ave-rest-service/raw/master/docs/screenshot.png)

This application is the front end for the [ave-rest-service](https://github.com/nlesc-ave/ave-rest-service) back end.
The front end runs in the users web browser and communicates with the back end running on a web server somewhere.
The front end is the user interface and the back end is the service serving the variant, annotation and genomic data.

The web application uses [pileup.js](https://github.com/hammerlab/pileup.js) to render genomic regions.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app).

## Installation

The build archive of the latest commit on the master branch can be downloaded from https://bintray.com/nlesc-ave/ave/ave-app#files, it is automatically build on [Travis-CI](https://travis-ci.org/nlesc-ave/ave-app).

See https://github.com/nlesc-ave/ave-rest-service#installation how to combine the [build archive](https://bintray.com/nlesc-ave/ave/ave-app#files) or [build directory](#build) of this repo to a deployment which can be used by end-users.

## Develop

Below are instructions how to get a development version of the application up and running.

Requirements:

- caddy with http.cors plugin, https://caddyserver.com, static file server to proxy example api files
- Node.js, https://nodejs.org/, JavaScript runtime version 8 or higher
- yarn, https://yarnpkg.com/, Node.js packagage manager

Clone repo and then
```
yarn install
```

To develop you need some data to visualize, this repo includes an example Tomato dataset (http://bioviz.org/quickload/S_lycopersicum_May_2012/) in the `/api` directory. The variants, gene/feature seach are artificial, that is they always return the same results. The variants are hardcoded at the first 500 bp of any chromosome.
The dataset is missing the genome sequence (2bit) and gene annotations (bigbed), because of their large size.
The 2bit and bigbed must be downloaded/converted with the following commands.

```bash
cd api/genomes/SL.2.40/
wget http://bioviz.org/quickload/S_lycopersicum_May_2012/S_lycopersicum_May_2012.2bit \
http://bioviz.org/quickload/S_lycopersicum_May_2012/S_lycopersicum_May_2012.bed.gz \
http://bioviz.org/quickload/S_lycopersicum_May_2012/genome.txt
wget http://hgdownload.cse.ucsc.edu/admin/exe/linux.x86_64/bedToBigBed
# the version for mac os is available also available http://hgdownload.cse.ucsc.edu/admin/exe/macOSX.x86_64/
chmod +x bedToBigBed
# description field is too long for bedToBigBed so it must be trimmed
gunzip -c S_lycopersicum_May_2012.bed.gz | perl -n -e 'chomp;@F=split(/\t/);$F[13] = substr($F[13],0,255); print join("\t", @F),"\n";'  > S_lycopersicum_May_2012.bed.trimmed
./bedToBigBed -tab -type=bed12+2 S_lycopersicum_May_2012.bed.trimmed genome.txt S_lycopersicum_May_2012.bb
rm S_lycopersicum_May_2012.bed.gz S_lycopersicum_May_2012.bed.trimmed genome.txt bedToBigBed
cd -
```

Start development server
```bash
yarn start
```

This will open the web application in a web browser on `http://localhost:3000`.
It will also start an api web service using caddy with example api files.
Any changes made to files in `src/` directory will recompile the application and reload the page in the web browser.

### Format

To keep the formatting consistent, this repo uses the [Prettier](https://prettier.io/) code formatter.

To format files in `src/` run
```bash
yarn prettier
```

See https://prettier.io/ how to setup your editor.

### Build

The source code is written in [TypeScript](https://www.typescriptlang.org/) which must be compiled so the web browser can run it.

The application can be build using
```bash
yarn build
```

This will generate a `build` directory which must be served from the root of a web server.
It expects [ave-rest-service](https://github.com/nlesc-ave/ave-rest-service) running on `/api` path of the web server.
