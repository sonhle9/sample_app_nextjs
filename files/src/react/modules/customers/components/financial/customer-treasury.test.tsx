import {screen, waitFor, within} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {CustomerTreasury} from './customer-treasury';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {rest} from 'msw';

const PAYMENT_BASE_URL = `${environment.paymentsApiBaseUrl}/api/payments`;

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerCardDetails`, () => {
  it('render customer teasury list', async () => {
    const {queryClient} = renderWithConfig(<CustomerTreasury userId="mockId" walletId="mockId" />);
    const treasuryCard = await screen.findByTestId(/treasury-card-heading/);
    const treasuryExpandButton = await within(treasuryCard).findByRole('button', {
      expanded: false,
    });
    user.click(treasuryExpandButton);

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(await screen.findByTestId(/treasury-table-heading/)).toBeVisible();
  });

  it.each([
    {
      case: 'adjustment value is empty',
    },
    {
      case: 'adjustment value is 0.00',
      input: '0.00',
    },
  ])('should show error if %s', async ({input}) => {
    server.use(
      rest.get(`${PAYMENT_BASE_URL}/admin/users/:id/wallet/refresh-balance`, (req, res, ctx) =>
        res(
          ctx.json({
            id: req.params.id,
            balance: 20.81,
          }),
        ),
      ),
    );

    renderWithConfig(<CustomerTreasury userId="mockId" walletId="mockId" />);
    const adjustmentButton = await screen.findByTestId(/create-adjustment-button/);
    user.click(adjustmentButton);
    expect(await screen.findByText('Adjust customer balance')).toBeVisible();
    const adjustmentValueInput = await screen.findByTestId(/adjustment-value-input/);
    const submitButton = await screen.findByTestId(/adjustment-submit-button/);
    input && user.type(adjustmentValueInput, input);
    user.click(submitButton);
    expect(await screen.findByText(/Required a positive or negative number/)).toBeVisible();
  });

  it('should adjust customer customer payment', async () => {
    server.use(
      rest.get(`${PAYMENT_BASE_URL}/admin/users/:id/wallet/refresh-balance`, (req, res, ctx) =>
        res(
          ctx.json({
            id: req.params.id,
            balance: 20.81,
          }),
        ),
      ),
    );

    renderWithConfig(<CustomerTreasury userId="mockId" walletId="mockId" />);
    const VALID_INPUT = '2.5';
    const adjustmentButton = await screen.findByTestId(/create-adjustment-button/);
    user.click(adjustmentButton);
    expect(await screen.findByText('Adjust customer balance')).toBeVisible();
    const adjustmentValueInput = await screen.findByTestId(/adjustment-value-input/);
    const commentInput = await screen.findByTestId(/comment-input/);
    const submitButton = await screen.findByTestId(/adjustment-submit-button/);
    user.type(adjustmentValueInput, VALID_INPUT);
    user.type(commentInput, 'some comment');
    user.click(submitButton);
    expect(await screen.findByText(/Successfully granted RM2.5/)).toBeVisible();
  });
});
