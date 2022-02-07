import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from '../../../lib/test-helper';
import {
  apiFuelOrdersTestBaseUrl,
  MOCK_FUEL_ORDERS,
} from '../../../services/mocks/api-orders.service.mock';
import {
  FUEL_ORDER_FILTERS_PAYMENT_METHODS,
  FUEL_STATUS_DROPDOWN_OPTIONS,
} from '../fuel-orders.const';
import {FuelOrdersListing} from './fuel-orders-listing';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

beforeEach(() => {
  renderWithConfig(<FuelOrdersListing />);
});

it('renders fuel orders list', async () => {
  expect(screen.getByTestId('fuel-orders-list')).toBeVisible();
});

it('filters by entering order id ', async () => {
  expect.assertions(1);

  server.use(
    rest.get(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders`, (req, res, ctx) => {
      expect(req.url.searchParams.get('query')).toBe(MOCK_FUEL_ORDERS[0].orderId);
      return res(ctx.json([]));
    }),
  );

  const $searchInput = screen.getAllByTestId('fuel-order-search-orderId')[0];

  user.type($searchInput, MOCK_FUEL_ORDERS[0].orderId);
  user.keyboard('{Enter}');
});

it('filters by admin tags', async () => {
  user.click(screen.getAllByTestId('fuel-order-search-tags')[1]);
  const searchBox = screen.getAllByPlaceholderText('Search...')[0];

  user.type(searchBox, 'double');
  expect(searchBox).toHaveValue('double');
});

it('filters by status', async () => {
  expect.assertions(1);

  server.use(
    rest.get(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders`, (req, res, ctx) => {
      expect(req.url.searchParams.get('status')).toBe(
        FUEL_STATUS_DROPDOWN_OPTIONS.find((status) => status.label === 'Created')?.value,
      );
      return res(ctx.json([]));
    }),
  );
  user.click(screen.getAllByTestId('fuel-order-filter-status')[0]);
  user.click(screen.getAllByText('Created')[0]);
});

it('filters by date', () => {
  user.click(screen.getAllByTestId('fuel-order-filter-date')[0]);
  user.click(screen.getAllByText('Today')[0]);
});

it('filters by payment provider', async () => {
  expect.assertions(1);

  server.use(
    rest.get(`${apiFuelOrdersTestBaseUrl}/orders/admin/orders`, (req, res, ctx) => {
      expect(req.url.searchParams.get('paymentProvider')).toBe(
        FUEL_ORDER_FILTERS_PAYMENT_METHODS.find((payMethod) => payMethod.label === 'Setel Wallet')
          ?.value,
      );
      return res(ctx.json([]));
    }),
  );
  user.click(screen.getAllByTestId('fuel-order-filter-pay-methods')[0]);
  user.click(screen.getAllByText('Setel Wallet')[0]);
});

it('downloads csv', async () => {
  user.click(screen.getAllByText('DOWNLOAD CSV')[0]);
  const butConfirm = await screen.findByRole('button', {name: /CONFIRM/i});
  user.click(butConfirm);
});
