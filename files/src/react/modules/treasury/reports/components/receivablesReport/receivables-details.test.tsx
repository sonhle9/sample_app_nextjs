import {screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_REPORTS} from 'src/react/services/mocks/api-ledger.service.mock';
import {ReceivablesDetails} from './receivables-details';

describe(`<ReceivablesDetails />`, () => {
  it('shows the details', async () => {
    renderWithConfig(<ReceivablesDetails id={MOCK_REPORTS[0].id} />);

    await screen.findByText('5f583624c818c52e631793c5');
    expect(screen.getByText('Total amount')).toBeDefined();
  });
});
