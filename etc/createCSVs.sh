#!/bin/bash

args=$#

for (( i=1; i<$args; i+=1 ))
do
  echo ${!i}
  # split on .json, take stem
  stem=$(echo ${!i} | sed -E 's/(.*)\.json$/\1/')
  cat ${!i} | node ./convertToCSV.js > "$stem.csv"
done
