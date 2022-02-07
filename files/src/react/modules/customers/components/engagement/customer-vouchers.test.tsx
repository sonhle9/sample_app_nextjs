import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {CustomerVouchers} from './customer-vouchers';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Customer's Voucher`, () => {
  it('can open void voucher modal', async () => {
    renderWithConfig(<CustomerVouchers userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const voucherCardHeading = await screen.findByTestId(/voucher-card-heading/);
    const expandVoucherButton = await within(voucherCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandVoucherButton);

    expect(await screen.findByText(/BATCH NAME/i)).toBeDefined();
    expect(await screen.findByText(/REDEEM TYPE/i)).toBeDefined();
    const voidVoucherButtons = await screen.findAllByText(/VOID VOUCHER/);
    //open void voucher modal
    user.click(voidVoucherButtons[0]);
    expect(await screen.findByText(/Are you sure you want to void the voucher?/)).toBeDefined();
    expect(await screen.findByRole('button', {name: /CONFIRM/})).toBeDefined();
    const cancelButton = await screen.findByRole('button', {name: /CANCEL/});
    expect(cancelButton).toBeDefined();
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  it('can open expand inner table', async () => {
    renderWithConfig(<CustomerVouchers userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    const voucherCardHeading = await screen.findByTestId(/voucher-card-heading/);
    const expandVoucherButton = await within(voucherCardHeading).findByRole('button', {
      expanded: false,
    });
    //expand voucher card
    user.click(expandVoucherButton);

    const voucherTable = await screen.findByTestId(/voucher-outer-table/);
    const expandButtons = await within(voucherTable).findAllByTestId(
      /expand-voucher-table-row-button/,
    );
    //expand expandable content in table
    user.click(expandButtons[0]);
    expect(await screen.findByTestId(/voucher-inner-table/)).toBeDefined();
    expect(await screen.findByText(/EXPIRY DATE/)).toBeDefined();
    //able to view inner table
  });
});
