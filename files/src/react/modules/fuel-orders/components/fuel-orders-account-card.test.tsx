import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {FuelOrdersAccountCard} from './fuel-orders-account-card';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`FuelOrdersAccountCard`, () => {
  it('render fuel order list', async () => {
    renderWithConfig(<FuelOrdersAccountCard userId={'test-user-id'} />);
    const fuelOrderCard = await screen.findByTestId(/fuel-order-account-card/);
    user.click(await within(fuelOrderCard).findByRole('button'));
    expect(await screen.findByTestId('fuel-order-amount-col')).toBeVisible();
    const fuelOrderRowBtns = await screen.findAllByTestId(/expand-fuel-orders-details-btn/i);
    user.click(fuelOrderRowBtns[0]);
    expect(await screen.findByText(/Order Id/i)).toBeVisible();
  });
});
