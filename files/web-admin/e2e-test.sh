#!/bin/bash
set -e

echo "is ci: $CI";
echo "cleaning up previous coverage report...";

rm -rf .nyc_output coverage;

{
    echo "executing integration and e2e test...";

    npm run test-all:ci;

} && {

  echo "generating coverage report...";

  mkdir -p coverage/combined;

  cp ./coverage/cypress/coverage-final.json ./coverage/combined/from-cypress.json;
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
}