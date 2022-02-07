import * as React from 'react';
import {formatDate, formatMoney} from '@setel/portal-ui';
import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {
  emptyResponseHandler,
  MOCK_CHECKOUT_TRANSACTION,
  serverErrorHandler,
  singleDataResponseHandler,
} from 'src/react/services/mocks/api-checkout.service.mock';
import {server} from 'src/react/services/mocks/mock-server';
import CustomerCheckoutTransactions from './customer-checkout-transactions';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Customer Checkout Transactions', () => {
  const setupCheckoutComponent = async () => {
    renderWithConfig(
      <CustomerCheckoutTransactions userId={'54492d7c-bd03-414a-ae72-01b5924a9a17'} />,
    );
    const checkoutHeading = screen.getByTestId('checkout-card-heading');
    return within(checkoutHeading).findByRole('button', {
      expanded: false,
    });
  };

  it('should render customer checkout component card', async () => {
    await setupCheckoutComponent();
    const card = screen.getByTestId('financial-checkout-transactions-card');

    expect(card).toBeVisible();
  });

  it('should render warning if no userId was found', async () => {
    renderWithConfig(<CustomerCheckoutTransactions userId={null} />);
    const checkoutHeading = screen.getByTestId(/checkout-card-heading/);
    const expandButton = await within(checkoutHeading).findByRole('button', {
      expanded: false,
    });
    userEvent.click(expandButton);
    const text = screen.getByText(/You have no data to be displayed here/i);

    expect(text).toBeVisible();
  });

  it('should render checkout header', async () => {
    const expandButton = await setupCheckoutComponent();
    userEvent.click(expandButton);

    expect(screen.getByText(/TRANSACTION ID/)).toBeVisible();
    expect(screen.getByText(/STATUS/)).toBeVisible();
    expect(screen.getByText(/MERCHANT/)).toBeVisible();
    expect(screen.getByText(/PAYMENT METHOD/)).toBeVisible();
    expect(screen.getByText(/AMOUNT/)).toBeVisible();
    expect(screen.getByText(/CREATED ON/)).toBeVisible();
  });

  it('should show checkout transaction with after fetching data', async () => {
    //mock server response with single item
    server.use(singleDataResponseHandler);

    const expandButton = await setupCheckoutComponent();
    userEvent.click(expandButton);

    const table = await screen.findByTestId('financial-checkout-data-table');

    await waitFor(
      () => {
        expect(within(table).queryByText(MOCK_CHECKOUT_TRANSACTION.id)).toBeDefined();
        expect(within(table).queryByText(MOCK_CHECKOUT_TRANSACTION.status)).toBeDefined();
        expect(within(table).queryByText(MOCK_CHECKOUT_TRANSACTION.merchantName)).toBeDefined();
        expect(within(table).queryByText('Setel Wallet')).toBeDefined();
        expect(
          within(table).queryByText(
            formatMoney(MOCK_CHECKOUT_TRANSACTION.amount, {
              currency: MOCK_CHECKOUT_TRANSACTION.currency,
            }),
          ),
        ).toBeDefined();
        expect(
          within(table).queryByText(formatDate(MOCK_CHECKOUT_TRANSACTION.createdAt)),
        ).toBeDefined();
      },
      {timeout: 2000},
    );
  });

  it('should render empty data message in case api error', async () => {
    // mock server response with status code 500
    server.use(serverErrorHandler);

    const expandButton = await setupCheckoutComponent();
    userEvent.click(expandButton);

    await waitFor(() =>
      expect(screen.queryByText(/You have no data to be displayed here/i)).toBeVisible(),
    );
  });

  it('should show error message if api returns empty response', async () => {
    // mock server response with status code 200 but empty array in response
    server.use(emptyResponseHandler);

    const expandButton = await setupCheckoutComponent();
    userEvent.click(expandButton);

    await waitFor(() =>
      expect(screen.queryByText(/You have no data to be displayed here/i)).toBeVisible(),
    );
  });

  it('should display transaction error for transactions with failed status', async () => {
    const expandButton = await setupCheckoutComponent();
    userEvent.click(expandButton);
    const table = await screen.findByTestId('financial-checkout-data-table');
    const search = screen.getByLabelText(
      /Transaction ID, Order Id, Merchant name, Sub Merchant Name/i,
    );
    userEvent.type(search, 'diana');
    userEvent.type(search, '{enter}');

    await waitFor(() => {
      expect(within(table).queryByText(/FAILED/i)).toBeVisible();
      expect(within(table).queryByText(/Internal server error/i)).toBeVisible();
    });
  });
});
