#!/bin/bash
set -e

echo "is ci: $CI";

echo "generating coverage report...";

mkdir -p coverage/combined;

cp ./coverage/cypress0/coverage-final.json ./coverage/combined/from-cypress0.json;
cp ./coverage/cypress1/coverage-final.json ./coverage/combined/from-cypress1.json;
cp ./coverage/cypress2/coverage-final.json ./coverage/combined/from-cypress2.json;
cp ./coverage/cypress3/coverage-final.json ./coverage/combined/from-cypress3.json;
cp ./coverage/cypress4/coverage-final.json ./coverage/combined/from-cypress4.json;
cp ./coverage/cypress5/coverage-final.json ./coverage/combined/from-cypress5.json;
cp ./coverage/cypress6/coverage-final.json ./coverage/combined/from-cypress6.json;
cp ./coverage/cypress7/coverage-final.json ./coverage/combined/from-cypress7.json;
cp ./coverage/cypress8/coverage-final.json ./coverage/combined/from-cypress8.json;
cp ./coverage/cypress9/coverage-final.json ./coverage/combined/from-cypress9.json;
cp ./coverage/jest/coverage-final.json ./coverage/combined/from-jest.json;

# merge report in coverage-report folder
npm run coverage:merge;
ls -l .nyc_output;
ls -l coverage/combined;
# generate the report in coverage-report folder
if [[ -z "${CI}" ]]; then
  npm run coverage:generate-combine-details;
else
  npm run coverage:generate-combine;
fi
