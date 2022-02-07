import {screen, within, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {MOCK_GL_PARAMETERS} from 'src/react/services/mocks/api-ledger.service.mock';
import {GeneralLedgerParameterDetails} from './general-ledger-parameter-details';

describe(`<GeneralLedgerParameterDetails />`, () => {
  it(`shows the details`, async () => {
    renderWithConfig(<GeneralLedgerParameterDetails id={MOCK_GL_PARAMETERS[0].id} />);

    await screen.findByText('Gift Card');
    user.click(screen.getByText('DISABLE'));

    await screen.findByText('Are you sure you want to disable this general ledger code?');
    user.click(within(screen.getByTestId('disable-dialog')).getByText('DISABLE'));

    const $enableBtn = await screen.findByText('ENABLE');
    expect($enableBtn).not.toBeNull();
    user.click($enableBtn);

    const $editBtn = await screen.findByText('EDIT');
    expect($editBtn).not.toBeNull();
    user.click($editBtn);

    const $editModal = await screen.findByLabelText('Edit general ledger codes');
    expect($editModal).not.toBeNull();

    user.clear(within($editModal).getByLabelText('Transaction type'));
    user.click(within($editModal).getByText('SAVE'));

    await waitForElementToBeRemoved($editModal);
  });
});
