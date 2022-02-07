import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from '../../../lib/test-helper';
import {RiskProfileDetails} from './risk-profile-details';
import {countryOptions} from '../risk-profile.const';

describe(`<RiskProfileDetails />`, () => {
  it('renders details', async () => {
    renderWithConfig(<RiskProfileDetails id="sample-account-id" />);

    const withinStoreList = within(screen.getByTestId('risk-profile-details'));

    expect(await withinStoreList.findByText(/Risk profile details/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Account ID/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Account name/i)).toBeDefined();
    expect(await withinStoreList.findAllByText('ID number')).toHaveLength(1);

    expect(await withinStoreList.findByText(/Risk score/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Risk rating/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Created on/i)).toBeDefined();
    expect(await withinStoreList.findByText('Updated on', {exact: true})).toBeDefined();
    expect(await withinStoreList.findByText(/Last scored on/i)).toBeDefined();

    expect(await withinStoreList.findByText(/Risk scoring/i)).toBeDefined();
    expect(await withinStoreList.findByText(/SCORING CATEGORY/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Customer’s country of residence/i)).toBeDefined();

    expect(await withinStoreList.findByText(/Customer’s nationality/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Customer’s nature of business/i)).toBeDefined();
    expect(await withinStoreList.findByText(/Wallet size/i)).toBeDefined();
    expect(await withinStoreList.findByText('KYC')).toBeDefined();
    expect(await withinStoreList.findByText(/Annual transaction/i)).toBeDefined();

    expect(await withinStoreList.findAllByText('Check for')).toHaveLength(2);
    expect(await withinStoreList.findByText(/Remarks/i)).toBeDefined();

    expect(await withinStoreList.findByText(/History/i)).toBeDefined();
  });

  it('should return country id with 3 chars', async () => {
    expect(countryOptions[0]).toEqual({
      label: 'Andorra',
      value: 'AND',
    });
  });
});
