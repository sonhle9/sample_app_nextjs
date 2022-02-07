import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {
  CustomerTopUp,
  AutoTopUp,
  ExpiringWalletBalance,
  IncomingBalanceTransaction,
  PaymentVendorTransaction,
  CreditDebitCards,
} from './customer-top-ups';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Customer's Top-up`, () => {
  it('can open Top-up card with user', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const topUpCardHeading = await screen.findByTestId(/top-up-card-heading/);
    const expandTopUpCardButton = await within(topUpCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandTopUpCardButton);

    expect(await screen.findByText(/TRANSACTION ID/i)).toBeDefined();
    expect(await screen.findByText(/STATUS/i)).toBeDefined();
    expect(await screen.findByText(/AMOUNT/i)).toBeDefined();
    expect(await screen.findByText(/CREATED ON/i)).toBeDefined();
    expect(await screen.findByText(/You have no data to be displayed here/)).toBeDefined();
  });

  it('can open Record External Top-up modal', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const topUpCardHeading = await screen.findByTestId(/top-up-card-heading/);
    const openRecordExternalTopUpModalButton = await within(topUpCardHeading).findByTestId(
      /record-external-top-up-button/,
    );
    user.click(openRecordExternalTopUpModalButton);

    expect(await screen.findAllByText(/Type/)).toBeDefined();
    expect(await screen.findByText(/Amount/)).toBeDefined();
    expect(await screen.findByText(/Custom Descriptor/)).toBeDefined();

    //Test Cancel button of Record External Top-up modal
    const cancelButton = await screen.findByTestId(/record-external-modal-cancel-button/);
    expect(cancelButton).toBeDefined();
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  it('can open Grant Wallet Ballance modal', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const topUpCardHeading = await screen.findByTestId(/top-up-card-heading/);
    const openGrantWalletBalanceButton = await within(topUpCardHeading).findByTestId(
      /grant-wallet-balance-button/,
    );
    user.click(openGrantWalletBalanceButton);

    expect(await screen.findByText(/Amount/)).toBeDefined();
    expect(await screen.findByText(/Expiry date/)).toBeDefined();
    expect(await screen.findByText(/Tags/)).toBeDefined();
    expect(await screen.findByText(/Description/)).toBeDefined();

    //Test Cancel button ofGrant Wallet Ballance modal
    const cancelButton = await screen.findByTestId(/grant-wallet-modal-cancel-button/);
    expect(cancelButton).toBeDefined();
    user.click(cancelButton);
    expect(cancelButton).not.toBeVisible();
  });

  it('can add valid tags', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const invalidText = 'InvalidText';
    const invalidLongText = 'invalidlongtextinvalidlongtextinvalidlongtext';
    const validInput1 = 'itagu';
    const validInput2 = 'i-tag-u-again';

    const topUpCardHeading = await screen.findByTestId(/top-up-card-heading/);
    const openRecordExternalTopUpModalButton = await within(topUpCardHeading).findByTestId(
      /grant-wallet-balance-button/,
    );
    user.click(openRecordExternalTopUpModalButton);

    expect(await screen.findByText(/Amount/)).toBeDefined();
    const inputField = (await screen.findByTestId(/tags-input/)) as HTMLInputElement;

    user.type(inputField, invalidText);
    user.type(inputField, '{enter}'); // enter does not take effect due to validation
    expect(await screen.findByText('Tag must contain only a-z, 0-9, -, _')).toBeVisible();
    //clear all the input
    invalidText.split('').forEach(() => user.type(inputField, '{backspace}'));
    user.type(inputField, invalidLongText);
    expect(await screen.findByText('Tag length must be less or equal 25 characters')).toBeVisible();
    invalidLongText.split('').forEach(() => user.type(inputField, '{backspace}'));

    //Enter valid input
    user.type(inputField, validInput1);
    user.type(inputField, '{enter}');
    user.type(inputField, validInput2);
    user.type(inputField, '{enter}');
    expect(await screen.findByText(validInput1)).toBeVisible();
    expect(await screen.findByText(validInput2)).toBeVisible();
    expect(inputField.value).toBe('');
  });

  it('can validate require message in Grant Wallet Balance', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);

    const openGrantWalletBalanceButton = await screen.findByRole('button', {
      name: /GRANT WALLET BALANCE/,
    });
    user.click(openGrantWalletBalanceButton);
    expect(await screen.findByText('Grant Wallet Balance')).toBeVisible();

    const modalBody = await screen.findByTestId(/grant-wallet-balance-modal/);
    expect(modalBody).toBeVisible();

    const submitButton = await screen.findByRole('button', {name: /SUBMIT/});
    expect(submitButton).toBeEnabled;

    user.click(submitButton);
    expect(await screen.findByText('Grant Wallet Balance')).toBeVisible();
    expect((await screen.findAllByText(/Required/)).length).toBe(3);
  });

  it('can validate require message in Record External Top-Up', async () => {
    renderWithConfig(<CustomerTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const topUpCardHeading = await screen.findByTestId(/top-up-card-heading/);
    const openRecordExternalTopUpModalButton = await within(topUpCardHeading).findByTestId(
      /record-external-top-up-button/,
    );
    user.click(openRecordExternalTopUpModalButton);
    expect(await screen.findByText(/Record external top-up/)).toBeDefined();
    expect(await screen.findByText(/AMOUNT/)).toBeDefined();

    const submitButton = await screen.findByTestId(/submitButton/);
    user.click(submitButton);
    expect((await screen.findAllByText(/Required/)).length).toBe(2);
    expect(submitButton).toBeEnabled();

    const typeField = await screen.findByText(/Select Type/);
    //choose option from dropdown
    user.click(typeField);
    expect(await screen.findByText(/External top-up refund/)).toBeVisible();
    const typeField2 = await screen.findByText(/External top-up refund/);
    user.click(typeField2);

    //fill in money input
    const MoneyInput = (await screen.findByTestId(/money/)) as HTMLInputElement;
    const validMoneyInput = '40000';
    user.type(MoneyInput, validMoneyInput);

    //fill in Custom Descriptor
    const customDescriptor = (await screen.findByTestId(/customDescriptor/)) as HTMLInputElement;
    const validDescription = 'test';
    user.type(customDescriptor, validDescription);
  });
});

describe(`Customer's Incoming balance transactions`, () => {
  it('can open Incoming balance transactions', async () => {
    renderWithConfig(
      <IncomingBalanceTransaction userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />,
    );
    const incomingBalanceTransactionHeading = await screen.findByTestId(
      /customer-incoming-balance-transactions-card/,
    );
    const expandIncomingBalanceTransactionButton = await within(
      incomingBalanceTransactionHeading,
    ).findByRole('button', {
      expanded: false,
    });
    user.click(expandIncomingBalanceTransactionButton);

    expect(await screen.findByText(/AMOUNT/i)).toBeDefined();
    expect(await screen.findByText(/STATUS/i)).toBeDefined();
    expect(await screen.findByText(/TRANSACTION ID/i)).toBeDefined();
    expect(await screen.findByText(/TOP UP METHOD/i)).toBeDefined();
    expect(await screen.findByText(/You have no data to be displayed here/)).toBeDefined();
  });
});

describe(`Customer's Payment transactions`, () => {
  it('can open Payment transactions', async () => {
    renderWithConfig(<PaymentVendorTransaction userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const paymentVendorTransactionHeading = await screen.findByTestId(
      /customer-payment-vendor-transaction-card/,
    );
    const expandpaymentVendorTransactionButton = await within(
      paymentVendorTransactionHeading,
    ).findByRole('button', {
      expanded: false,
    });
    user.click(expandpaymentVendorTransactionButton);

    expect(await screen.findByText(/AMOUNT/i)).toBeDefined();
    expect(await screen.findByText(/FULL NAME/i)).toBeDefined();
    expect(await screen.findByText(/REFERENCE ID/i)).toBeDefined();
    expect(await screen.findByText(/TYPE/i)).toBeDefined();
    expect(await screen.findByText(/CREATED ON/i)).toBeDefined();
    expect(await screen.findByText(/You have no data to be displayed here/)).toBeDefined();
  });
});

describe(`Customer's Credit-debit card`, () => {
  it('can open Credit-debit card', async () => {
    renderWithConfig(<CreditDebitCards userId={'07698130-a257-427e-adac-bdffa84e771a'} />);
    const CreditCardHeading = await screen.findByTestId(/customer-credit-debit-card/);
    const expandCreditCardButton = await within(CreditCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandCreditCardButton);

    expect(await screen.findByText(/CARD DETAILS/i)).toBeDefined();
    expect(await screen.findByText(/PRIMARY/i)).toBeDefined();
    expect(await screen.findByText(/ACTION/i)).toBeDefined();
    expect(await screen.findByText(/You have no data to be displayed here/)).toBeDefined();
  });
});

describe(`Customer's Auto top-up`, () => {
  it('can open Auto top-up', async () => {
    renderWithConfig(<AutoTopUp userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);
    const AutoTopUpHeading = await screen.findByTestId(/customer-auto-top-up-card/);
    const expandAutoTopUpButton = await within(AutoTopUpHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandAutoTopUpButton);

    expect(await screen.findByText(/CARD/i)).toBeDefined();
    expect(await screen.findByText(/STATUS/i)).toBeDefined();
    expect(await screen.findByText(/MINIMUM BALANCE/i)).toBeDefined();
    expect(await screen.findByText(/TOP-UP AMOUNT/i)).toBeDefined();
    expect(await screen.findByText(/UPDATE ON/i)).toBeDefined();
    expect(await screen.findByText(/You have no data to be displayed here/)).toBeDefined();
  });
});

describe(`Customer's Expiring Wallet Balance`, () => {
  it('can open Expiring Wallet Balance', async () => {
    renderWithConfig(<ExpiringWalletBalance userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />);

    expect(await screen.findByText(/Expiring Wallet Balance/i)).toBeDefined();
    expect(await screen.findByText(/RM/i)).toBeDefined();
  });
});
