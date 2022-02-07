import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {Formik} from 'formik';
import {renderWithConfig} from 'src/react/lib/test-helper';

import {RiskProfileUpdateModal} from './risk-profile-update-modal';

import {RiskProfileDetails} from '../../../../services/api-risk-profiles.service';

afterEach(cleanup);

describe(`<RiskProfileUpdateModal />`, () => {
  it('should render RiskProfileUpdateModal', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <RiskProfileUpdateModal
            isLoading={false}
            riskProfileData={
              {
                customerType: {value: undefined},
                countryOfResident: {value: undefined},
                nationality: {value: undefined},
                watchList: {value: undefined},
                natureOfBusiness: {value: undefined},
                walletSize: {value: undefined},
                kyc: {value: undefined},
                annualTransaction: {value: undefined},
              } as RiskProfileDetails
            }
            onClose={() => {}}
            serverError={''}
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
            checkForOptions={[]}
            isUpdating={false}
            handleSubmit={() => {}}
          />
        )}
      </Formik>,
    );

    const modal = within(screen.getByTestId('risk-profile-modal'));

    const customerType = modal.getByTestId('risk-profile-customer-type-select');
    const countryOfResident = modal.getByTestId(
      'risk-profile-country-of-resident',
    ) as HTMLInputElement;
    const customerNationality = modal.getByTestId('risk-profile-customer-nationality-select');

    expect(customerType).toBeDefined();
    expect(countryOfResident).toBeDefined();
    expect(customerNationality).toBeDefined();
    expect(customerType.getAttribute('aria-disabled')).toBeTruthy();
    expect(countryOfResident.disabled).toBeTruthy();
    expect(customerNationality).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-watchlist-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-nature-of-business-select')).toBeDefined();

    expect(
      await modal.findByTestId('risk-profile-account-id').catch(() => undefined),
    ).toBeUndefined();
    expect(
      await modal.findByTestId('risk-profile-type-of-id-select').catch(() => undefined),
    ).toBeUndefined();
    expect(
      await modal.findByTestId('risk-profile-id-number').catch(() => undefined),
    ).toBeUndefined();
    expect(modal.getByTestId('check-for-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-remarks')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-watchlist-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-nature-of-business-select')).toBeDefined();
    expect(
      (modal.getByTestId('risk-profile-submit-btn') as HTMLButtonElement).disabled,
    ).toBeFalsy();
  });

  it('should render RiskProfileUpdateModal with disabled button', () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <RiskProfileUpdateModal
            isLoading={false}
            riskProfileData={
              {
                customerType: {value: undefined},
                countryOfResident: {value: undefined},
                nationality: {value: undefined},
                watchList: {value: undefined},
                natureOfBusiness: {value: undefined},
                walletSize: {value: undefined},
                kyc: {value: undefined},
                annualTransaction: {value: undefined},
              } as RiskProfileDetails
            }
            onClose={() => {}}
            serverError={''}
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
            checkForOptions={[]}
            isUpdating={true}
            handleSubmit={() => {}}
          />
        )}
      </Formik>,
    );

    expect(screen.getByTestId('risk-profile-submit-btn')).toBeDisabled();
  });
});
