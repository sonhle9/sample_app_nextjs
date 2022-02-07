import {titleCase} from '@setel/portal-ui';
import {getAllCountries} from 'countries-and-timezones';
import {RiskRatingLevel} from 'src/react/services/api-risk-profiles.service';
import dataIso2ToIso3 from './country-code-iso-3.json';

export const ratingOptions = Object.values(RiskRatingLevel).map((value) => ({
  value,
  label: titleCase(value),
}));

export const countryOptions = Object.values(getAllCountries()).map((country) => {
  const idISO3 = dataIso2ToIso3[country.id];
  return {
    label: country.name,
    value: idISO3,
  };
});
