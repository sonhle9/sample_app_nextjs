import * as React from 'react';
import {screen} from '@testing-library/react';
import {formatDate} from '@setel/portal-ui';

import {server} from '../../../../services/mocks/mock-server';
import {renderWithConfig} from '../../../../lib/test-helper';
import {CustomerSetelShare} from './customer-setelshare';
import user from '@testing-library/user-event';
beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerRiskProfile`, () => {
  it('renders customer setelshare', async () => {
    renderWithConfig(<CustomerSetelShare userId={'059bf1a8-a494-4147-9adf-4b5871b679d6'} />);

    expect(await screen.findByText('6135816cf1c9160012ec6f73')).toBeDefined();
    expect(await screen.findByText('No')).toBeDefined();
    expect(await screen.findByText('owner')).toBeDefined();
    expect(await screen.findByText('blocked')).toBeDefined();
    const expandButton = await screen.findByTestId(/expand-button/);

    user.click(expandButton);

    expect(
      await screen.findByText(formatDate('2021-09-06T02:48:12.110Z', {formatType: 'dateAndTime'})),
    ).toBeDefined();
    expect(await screen.findByText('Setel Wallet')).toBeDefined();
  });
});
