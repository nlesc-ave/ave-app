#!/bin/sh

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
