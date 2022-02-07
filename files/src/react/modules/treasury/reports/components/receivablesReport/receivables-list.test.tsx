import {screen} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ReceivablesList} from './receivables-list';

describe(`<ReceivablesList />`, () => {
  it('shows the payables report list', async () => {
    renderWithConfig(<ReceivablesList />);

    const records = await screen.findAllByTestId('receivables-record');
    expect(records.length).toBe(2);
    expect(screen.getByText(/DOWNLOAD CSV/i).getAttribute('disabled')).toBe(null);

    expect(screen.getByText('5f696c12c4bdf90012537c90'));
    expect(screen.getByText('5f583624c818c52e631793c5'));
  });
});
