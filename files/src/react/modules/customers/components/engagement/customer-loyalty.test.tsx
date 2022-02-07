import {screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {CustomerLoyaltySection} from './customer-loyalty';
import {AddLoyaltyCardModal, GrantLoyaltyPointsModal} from './customer-loyalty-modal';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`Customer's Loyalty test`, () => {
  it('can view loyalty card', async () => {
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'}
        customerName="Megatest"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandLoyaltyCardButton = await within(loyaltyCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandLoyaltyCardButton);

    expect(await screen.findByText(/●●1702/)).toBeVisible();

    const loyaltyUnlinkHistoryCard = await screen.findByTestId(/loyalty-unlink-history-card/);
    const expandLoyaltyUnlinkButton = await within(loyaltyUnlinkHistoryCard).findByRole('button', {
      expanded: false,
    });
    user.click(expandLoyaltyUnlinkButton);
    //unlink table expanded
    expect(
      await within(await screen.findByTestId(/loyalty-unlink-table/)).findByText(/CARD NUMBER/),
    ).toBeVisible();

    //loyalty transactions card
    const loyaltyTransactionsCard = await screen.findByTestId(/loyalty-transactions-card/);
    const expandLoyaltyTransactionsButton = await within(loyaltyTransactionsCard).findByRole(
      'button',
      {
        expanded: false,
      },
    );
    user.click(expandLoyaltyTransactionsButton);

    expect(
      await within(await screen.findByTestId(/loyalty-unlink-table/)).findByText(/CARD NUMBER/),
    ).toBeVisible();
    const transactionLinks = (await screen.findAllByTestId(
      /loyalty-txn-link/,
    )) as HTMLAnchorElement[];
    expect(transactionLinks[0].href.includes('/payments/transactions/loyalty')).toBe(true);
    const expandsTxnButtons = await screen.findAllByTestId(/expand-loyalty-txn-button/);
    user.click(expandsTxnButtons[0]);
    expect((await screen.findAllByText(/Issued by/))[0]).toBeVisible();
    expect((await screen.findAllByText(/Error message/))[0]).toBeVisible();

    //Loyalty vendor card
    const loyaltyVendorTxnCard = await screen.findByTestId(/loyalty-vendor-txn-card/);
    user.click(await within(loyaltyVendorTxnCard).findByRole('button', {expanded: false}));
    expect(await screen.findByText(/MERCHANT NAME/)).toBeVisible();
  });

  it('validates card number in add card modal', async () => {
    const validCardNumberWithSpace = '7083 8156 12 385 17 02';
    const cardNumberMoreThan17Characters = '012345678912345678'; // 18 characters
    const nonNumericCardNumber = '0123456789123456a'; // 17 characters but 1 alphabet

    renderWithConfig(<AddLoyaltyCardModal userId={'1234'} isOpen={true} dismiss={() => {}} />);
    const addCardInput = (await screen.findByTestId(/add-card-input/)) as HTMLInputElement;
    user.type(addCardInput, validCardNumberWithSpace);
    // will replace spaces
    expect(addCardInput.value.length).toBe(17);
    // remove the input
    validCardNumberWithSpace.split('').forEach(() => user.type(addCardInput, '{backspace}'));
    user.type(addCardInput, cardNumberMoreThan17Characters);
    expect(await screen.findByText(/Card number must be 17 characters long/i)).toBeVisible();
    //remove input
    cardNumberMoreThan17Characters.split('').forEach(() => user.type(addCardInput, '{backspace}'));
    user.type(addCardInput, nonNumericCardNumber);
    expect(await screen.findByText(/Card number must be numeric/i)).toBeVisible();
  });

  it('validates grant mesra points modal', async () => {
    const validInput = '12';
    const invalidInput = '0';
    const invalidFloatNumber = '1.23';

    renderWithConfig(<GrantLoyaltyPointsModal userId={'1234'} isOpen={true} dismiss={() => {}} />);
    const pointsInput = (await screen.findByTestId(
      /grant-point-input-points/i,
    )) as HTMLInputElement;
    const saveButton = await screen.findByRole('button', {name: /SAVE CHANGES/});
    // empty input should disable the button
    expect(saveButton).toBeDisabled();
    user.type(pointsInput, validInput);
    expect(saveButton).toBeEnabled();
    user.type(pointsInput, '{backspace}');
    user.type(pointsInput, '{backspace}');
    user.type(pointsInput, invalidInput);
    expect(saveButton).toBeDisabled();
    user.type(pointsInput, '{backspace}');
    user.type(pointsInput, invalidFloatNumber);
    expect(pointsInput.value).not.toBe('1.23');
  });

  it('can open Grant Mesra Point Modal', async () => {
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'}
        customerName="Megatest"
      />,
    );
    const GrantMesraPointButton = await screen.findByRole('button', {name: /GRANT MESRA POINT/});
    user.click(GrantMesraPointButton);
    expect(await screen.findByText(/Grant points/)).toBeVisible();

    const validInput = '120';
    const saveButton = await screen.findByRole('button', {name: /SAVE CHANGES/});
    const pointsInput = (await screen.findByTestId(
      /grant-point-input-points/i,
    )) as HTMLInputElement;
    // empty input should disable the button
    expect(saveButton).toBeDisabled();
    user.type(pointsInput, validInput);
    expect(saveButton).toBeEnabled();
    user.click(saveButton);

    server.use(
      rest.post(
        `${environment.loyaltyApiBaseUrl}/api/loyalty/system/manuallyGrantPetronasPoints`,
        (_, res, ctx) => {
          return res(
            ctx.status(202),
            ctx.json({
              approvalCode: '190000',
              cardNumber: '70838156123851702',
              cardStatus: 'issued',
              earnedPoints: 120,
              id: '612efa1ad2934100127348a0',
              pointBalance: 120,
              pointRedeemBalance: 120,
              processedDateTime: '2021-09-01T03:57:10.619Z',
              redeemedPoints: 0,
              vendorTransactionId: '000016568811',
            }),
          );
        },
      ),
    );

    expect(await screen.findByText(/Loyalty points was successfully granted./)).toBeVisible();
  });

  it(
    'can trigger error message in Grant Mesra Point Modal',
    suppressConsoleLogs(async () => {
      renderWithConfig(
        <CustomerLoyaltySection
          userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'}
          customerName="Megatest"
        />,
      );
      const GrantMesraPointButton = await screen.findByRole('button', {name: /GRANT MESRA POINT/});
      user.click(GrantMesraPointButton);
      expect(await screen.findByText(/Grant points/)).toBeVisible();

      const validInput = '120';
      const saveButton = await screen.findByRole('button', {name: /SAVE CHANGES/});
      const pointsInput = (await screen.findByTestId(
        /grant-point-input-points/i,
      )) as HTMLInputElement;
      // empty input should disable the button
      expect(saveButton).toBeDisabled();
      user.type(pointsInput, validInput);
      expect(saveButton).toBeEnabled();
      user.click(saveButton);

      server.use(
        rest.post(
          `${environment.loyaltyApiBaseUrl}/api/loyalty/system/manuallyGrantPetronasPoints`,
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                message: 'Amount cannot be more than RM1000',
                name: 'InputValidationError',
                statusCode: 400,
              }),
            );
          },
        ),
      );

      expect(await screen.findByText(/Amount cannot be more than RM1000/)).toBeVisible();
    }),
  );

  it('can open Update Loyalty Card Modal', async () => {
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'}
        customerName="Megatest"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandManageCardButton = await within(loyaltyCardHeading).findByTestId(
      /manage-card-button/,
    );
    user.click(expandManageCardButton);

    const updateLoyaltyCardModal = await screen.findByText(/Update information and status/);
    user.click(updateLoyaltyCardModal);

    expect(await screen.findByText(/Update loyalty card/)).toBeVisible();
  });
  it('can open Unlink Loyalty Card Modal', async () => {
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'d812d91d-fd8b-48d9-b889-25150c93c38f'}
        customerName="Megatest"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandManageCardButton = await within(loyaltyCardHeading).findByTestId(
      /manage-card-button/,
    );
    user.click(expandManageCardButton);

    const unlinkCardModal = await screen.findByText(/Unlink Card/);
    user.click(unlinkCardModal);

    expect(await screen.findByText(/Unlink loyalty card/)).toBeVisible();

    const deleteButton = await screen.findByText(/DELETE/);

    user.click(deleteButton);

    await waitForElementToBeRemoved(deleteButton);
  });
  it('render another customer with Setel as its provider and 130 mesra point', async () => {
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'91243e2c-cf30-4012-bb6d-567e89e200aa'}
        customerName="Megatest"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandLoyaltyCardButton = await within(loyaltyCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandLoyaltyCardButton);
    expect(await screen.findByText(/●●9455/)).toBeVisible();
    expect(await screen.findByText(/15000 points/)).toBeVisible();
  });
});

describe('Customer Loyalty with No Data ', () => {
  it('render Loyalty card', async () => {
    server.use(
      rest.get(`${environment.apiBaseUrl}/system/cards/:id`, (_, res, ctx) => {
        return res.once(ctx.status(404));
      }),
    );
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'e2218fea-fd67-4807-a59c-c80a8a4f56d1'}
        customerName="maeil"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandLoyaltyCardButton = await within(loyaltyCardHeading).findByRole('button', {
      expanded: false,
    });
    user.click(expandLoyaltyCardButton);

    expect(await screen.findByText(/Loyalty card not found/)).toBeVisible();
  });
  it('can open Add Card Modal', async () => {
    server.use(
      rest.get(`${environment.apiBaseUrl}/api/ops/users/:id/loyalty-cards`, (_, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json({
            message: 'Card not found',
            name: 'NotFoundError',
            statusCode: 404,
          }),
        );
      }),
    );
    renderWithConfig(
      <CustomerLoyaltySection
        userId={'e2218fea-fd67-4807-a59c-c80a8a4f56d1'}
        customerName="maeil"
      />,
    );
    const loyaltyCardHeading = await screen.findByTestId(/loyalty-card-heading/);
    const expandManageCardButton = await within(loyaltyCardHeading).findByTestId(
      /manage-card-button/,
    );
    user.click(expandManageCardButton);

    const AddCardModal = await screen.findByText(/Add Card/);
    user.click(AddCardModal);
    expect(await screen.findByText(/Add loyalty card/)).toBeVisible();
  });
});
