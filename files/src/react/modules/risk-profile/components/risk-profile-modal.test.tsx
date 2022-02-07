import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';

import {RiskProfileModal} from './risk-profile-modal';

describe(`<RiskProfileModal />`, () => {
  it('renders creating modal', async () => {
    renderWithConfig(<RiskProfileModal onClose={() => {}} />);

    const riskProfileModal = within(screen.getByTestId('risk-profile-modal'));

    expect(await riskProfileModal.findByText(/Create new risk profile/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Customer Details/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Type of ID/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/ID number/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Customer's type/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Customer’s country of residence/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Customer's nationality/i)).toBeDefined();
    expect(await riskProfileModal.findAllByText(/Watchlist/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Customer's nature of business/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Check for/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/Remarks/i)).toBeDefined();
    expect(await riskProfileModal.findByText(/SAVE/i)).toBeDefined();
  });

  it('should render updating model', async () => {
    renderWithConfig(<RiskProfileModal onClose={() => {}} isUpdate={true} />);

    const riskProfileModal = within(screen.getByTestId('risk-profile-modal'));

    expect(
      await riskProfileModal.findByTestId('customer-details-fieldset').catch(() => undefined),
    ).toBeUndefined();
    expect(riskProfileModal.getByTestId('reason-fieldset')).toBeDefined();
    expect(riskProfileModal.getByTestId('scoring-category-fieldset')).toBeDefined();
  });
});
