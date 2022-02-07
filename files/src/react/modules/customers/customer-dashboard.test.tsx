import {screen, waitFor, within} from '@testing-library/dom';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {CustomerDashboard} from './customer-dashboard';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {MOCK_VERIFICATIONS} from 'src/react/services/mocks/api-verifications.service.mock';
import {rest} from 'msw';
import {AccountInfo} from 'src/react/modules/customers/components/account-info';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

beforeEach(() => {
  const BASE_URL = `${environment.verificationsApiBaseUrl}/api/verifications`;
  server.use(
    rest.get(
      `${BASE_URL}/verifications/customers/d812d91d-fd8b-48d9-b889-25150c93c38f/latest`,
      (_, res, ctx) =>
        res.once(
          ctx.json(
            MOCK_VERIFICATIONS.find(
              (item) => item.customerId === 'd812d91d-fd8b-48d9-b889-25150c93c38f',
            ),
          ),
        ),
    ),
  );
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerDashboard`, () => {
  it('renders AccountInfo, Loyalty Info, Latest Orders, Latest Transactions', async () => {
    renderWithConfig(<CustomerDashboard customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    expect(await screen.findByText(/megatest943@setel.my/)).toBeDefined();
    expect(await screen.findByText(/601666999943/)).toBeDefined();
    expect(await screen.findByText(/Account info/)).toBeDefined();
    expect(await screen.findByText(/Loyalty info/)).toBeDefined();
    expect(await screen.findByText(/CARD NUMBER/i)).toBeDefined();
    expect(await screen.findByText(/Latest order/)).toBeDefined();
    expect(await screen.findByText(/Latest payment/)).toBeDefined();
    expect(await screen.findByText(/Point balance/i)).toBeDefined();
    expect(await screen.findByText(/eKYC status/)).toBeDefined();
  });

  // it('should open unlink modal and unlink card', async () => {
  //   renderWithConfig(<CustomerDashboard customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
  //   const unlinkButton = await screen.findByText(/Unlink Card/i);
  //   expect(unlinkButton).toBeDefined();
  //   user.click(unlinkButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/Confirm unlinking card/)).toBeVisible();
  //     expect(screen.getByRole('button', {name: /CANCEL/i})).toBeVisible();
  //   });
  //   // const confirmButton = await screen.getByRole('button',{name: /Confirm/i});
  //   // user.click(confirmButton);
  //   // await waitFor(()=>{
  //   //   expect(screen.getByText(/Card unlinked/i)).toBeVisible();
  //   // });
  // });

  it('should expand order when clicked', async () => {
    renderWithConfig(<CustomerDashboard customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    user.click(await screen.findByTestId(/expand-order-button-5ec258be2a644b8fa4659824aac17281/));
    expect(await screen.findByText(/PETRONAS SKVE/)).toBeDefined();
    expect(screen.getByText(/active/i)).toBeDefined();
  });

  it('should expand payment when clicked', async () => {
    renderWithConfig(<CustomerDashboard customerID={'d812d91d-fd8b-48d9-b889-25150c93c38f'} />);
    expect(await screen.findByText(/Latest payment transaction/)).toBeVisible();
    const expandTransactionButtons = await screen.findAllByTestId(/expand-transaction-button/);
    const paymentTransactionSection = await screen.findByTestId(/payment-transaction-section/);

    user.click(expandTransactionButtons[1]);
    await waitFor(() => {
      expect(within(paymentTransactionSection).getByText(/Reference type/)).toBeDefined();
      expect(within(paymentTransactionSection).getByText(/Amount/)).toBeDefined();
      expect(within(paymentTransactionSection).getByText(/Wallet Balance/)).toBeDefined();
      expect(within(paymentTransactionSection).getByText(/Reference type/)).toBeDefined();
    });
    expect(await screen.findByText(/PETRONAS Batu 5 Gombak/i)).toBeDefined();
    expect(expandTransactionButtons.length).toBe(4);
  });

  it('should show eKYC status', async () => {
    renderWithConfig(
      <AccountInfo
        customerId="d812d91d-fd8b-48d9-b889-25150c93c38f"
        isLoyaltyInfoCardExist={false}
      />,
    );

    await screen.findByText('Not Found', {exact: true}, {timeout: 5000});
  });
});
