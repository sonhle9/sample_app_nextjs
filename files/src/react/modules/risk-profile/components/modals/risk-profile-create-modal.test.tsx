import * as React from 'react';
import {cleanup, screen, within} from '@testing-library/react';
import {Formik} from 'formik';
import {renderWithConfig} from 'src/react/lib/test-helper';

import {RiskProfileCreateModal} from './risk-profile-create-modal';

afterEach(cleanup);

describe(`<RiskProfileCreateModal />`, () => {
  it('should render RiskProfileCreateModal', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <RiskProfileCreateModal
            onClose={() => {}}
            serverError={''}
            typeOfIdOptions={[]}
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
            checkForOptions={[]}
            isCreating={false}
            handleSubmit={() => {}}
          />
        )}
      </Formik>,
    );

    const modal = within(screen.getByTestId('risk-profile-modal'));

    expect(modal.getByTestId('risk-profile-account-id')).toBeDefined();
    expect(modal.getByTestId('risk-profile-type-of-id-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-id-number')).toBeDefined();
    expect(modal.getByTestId('check-for-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-remarks')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-type-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-country-of-resident')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-nationality-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-watchlist-select')).toBeDefined();
    expect(modal.getByTestId('risk-profile-customer-nature-of-business-select')).toBeDefined();
    expect(
      (modal.getByTestId('risk-profile-submit-btn') as HTMLButtonElement).disabled,
    ).toBeFalsy();
  });

  it('should render RiskProfileCreateModal with disabled button', async () => {
    renderWithConfig(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <RiskProfileCreateModal
            onClose={() => {}}
            serverError={''}
            typeOfIdOptions={[]}
            customerTypeOptions={[]}
            nationalityOptions={[]}
            watchListOptions={[]}
            customerNatureOfBusinessOptions={[]}
            checkForOptions={[]}
            isCreating={true}
            handleSubmit={() => {}}
          />
        )}
      </Formik>,
    );

    expect(
      (screen.getByTestId('risk-profile-submit-btn') as HTMLButtonElement).disabled,
    ).toBeTruthy();
  });
});
