import {screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_REPORTS} from 'src/react/services/mocks/api-ledger.service.mock';
import {PayablesReportDetails} from './payables-details';

describe(`<PayablesReportDetails />`, () => {
  it('shows the details', async () => {
    renderWithConfig(<PayablesReportDetails id={MOCK_REPORTS[0].id} />);

    await screen.findByText('PAYABLES');
    expect(screen.getByText('Total amount')).toBeDefined();
  });
});
