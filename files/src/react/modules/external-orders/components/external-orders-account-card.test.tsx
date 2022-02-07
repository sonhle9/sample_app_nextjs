import {screen, within} from '@testing-library/dom';
import {server} from 'src/react/services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ExternalOrdersAccountCard} from './external-orders-account-card';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`ExternalOrdersAccountCard`, () => {
  it('can view external orders account section', async () => {
    renderWithConfig(<ExternalOrdersAccountCard userId={'48431c4b-9c6f-480e-930e-5dc9e1ceb471'} />);
    const externalOrderCard = await screen.findByTestId(/external-order-account-card/);
    user.click(await within(externalOrderCard).findByRole('button'));
    expect(await screen.findByTestId('external-order-amount-col')).toBeVisible();
    const externalOrderRowBtns = await screen.findAllByTestId(/external-order-data/);
    user.click(externalOrderRowBtns[0]);
    expect(await screen.findByText(/Amount/i)).toBeVisible();
    const externalOrderLink = (await screen.findAllByTestId(
      /external-orders-link/,
    )) as HTMLAnchorElement[];
    expect(externalOrderLink[0].href.includes('/external-orders/')).toBe(true);
  });

  // it('status filter working', async () => {
  //   renderWithConfig(<ExternalOrdersAccountCard userId={'48431c4b-9c6f-480e-930e-5dc9e1ceb471'} />);
  //   const statusFilter = (await screen.findAllByTestId(/filter-order-status/))[1];
  //   // status = ACTIVE
  //   user.click(statusFilter);
  //   user.type(statusFilter, '{arrowdown}{enter}');
  //   expect((await screen.findAllByText(/RESOLVED/, undefined, {timeout: 3000})).length).toBe(50);
  // });
});
