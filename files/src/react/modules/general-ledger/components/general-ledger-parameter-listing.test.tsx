import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_GL_PARAMETERS} from 'src/react/services/mocks/api-ledger.service.mock';
import {GeneralLedgerParameterListing} from './general-ledger-parameter-listing';

describe(`<GeneralLedgerParameterListing />`, () => {
  it(`display listing and filter based on status`, async () => {
    renderWithConfig(<GeneralLedgerParameterListing />);

    const records = await screen.findAllByTestId('gl-code-record');
    expect(records.length).toBe(2);

    const disabledRecord = MOCK_GL_PARAMETERS.find((item) => item.status === 'disabled');

    user.click(screen.getAllByTestId('status-filter')[0]);
    user.click(screen.getAllByText('Disabled')[0]);

    await screen.findByText(disabledRecord.transactionType);

    expect(screen.getAllByTestId('gl-code-record').length).toBe(1);
  });

  it(`can create gl code`, async () => {
    renderWithConfig(<GeneralLedgerParameterListing />);

    await screen.findAllByTestId('gl-code-record');

    user.click(screen.getByText('CREATE'));

    expect(screen.getByText('Create new general ledger codes')).not.toBeNull();

    user.click(screen.getByTestId('GL-profile'));
    user.type(screen.getByLabelText('Transaction type'), 'transaction type');

    const debitFields = within(screen.getByTestId('debit-fields'));
    const creditFields = within(screen.getByTestId('credit-fields'));

    user.type(debitFields.getByLabelText('GL code'), 'Debit GL Code');
    user.type(debitFields.getByLabelText('GL account no'), 'Debit Account No');
    user.type(debitFields.getByLabelText('GL account name'), 'Debit Account Name');
    user.click(debitFields.getByTestId('debit-extraction'));

    user.type(creditFields.getByLabelText('GL code'), 'Credit GL Code');
    user.type(creditFields.getByLabelText('GL account no'), 'Credit Account No');
    user.type(creditFields.getByLabelText('GL account name'), 'Credit Account Name');
    user.click(creditFields.getByTestId('credit-extraction'));

    user.click(screen.getByText('SAVE'));

    await waitForElementToBeRemoved(screen.getByText('Create new general ledger codes'));
  });
});
