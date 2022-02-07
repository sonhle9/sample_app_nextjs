import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {Formik} from 'formik';

import {ScoringCategoryFieldset} from './scoring-category-fieldset';

afterEach(cleanup);

describe(`<ScoringCategoryFieldset />`, () => {
  it('should render ScoringCategoryFieldset', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <ScoringCategoryFieldset
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
          />
        )}
      </Formik>,
    );

    const fieldset = within(screen.getByTestId('scoring-category-fieldset'));

    expect(fieldset.getByTestId('risk-profile-customer-type-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-country-of-resident')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-customer-nationality-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-customer-watchlist-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-customer-nature-of-business-select')).toBeDefined();
  });

  it('should render ScoringCategoryFieldset in update mode', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <ScoringCategoryFieldset
            isUpdate={true}
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
          />
        )}
      </Formik>,
    );

    const fieldset = within(screen.getByTestId('scoring-category-fieldset'));

    const customerType = fieldset.getByTestId('risk-profile-customer-type-select');
    const countryOfResident = fieldset.getByTestId(
      'risk-profile-country-of-resident',
    ) as HTMLInputElement;
    const customerNationality = fieldset.getByTestId('risk-profile-customer-nationality-select');

    expect(customerType).toBeDefined();
    expect(countryOfResident).toBeDefined();
    expect(customerNationality).toBeDefined();
    expect(customerType.getAttribute('aria-disabled')).toBeTruthy();
    expect(countryOfResident.disabled).toBeTruthy();
    expect(customerNationality).toBeDefined;
    expect(fieldset.getByTestId('risk-profile-customer-watchlist-select')).toBeDefined();
    expect(fieldset.getByTestId('risk-profile-customer-nature-of-business-select')).toBeDefined();
  });
});
