import {screen, within} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';

import {CustomerFraudProfile} from './customer-fraud-profile';

import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerFraudProfile`, () => {
  it('renders user fraud profile', async () => {
    renderWithConfig(<CustomerFraudProfile userId={'adaae01a-8421-49f5-9c24-b91d815cddfa'} />);

    const chargeLimitCard = await screen.findByTestId('charge-limit-card');
    user.click(await within(chargeLimitCard).findByRole('button', {expanded: false}));
    const blacklistCard = await screen.findByTestId('expand-blacklist');
    user.click(await within(blacklistCard).findByRole('button', {expanded: false}));

    expect(await within(blacklistCard).findByText('ADD')).toBeDefined();

    expect(await within(chargeLimitCard).findByText('EDIT')).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/Daily charge limit/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM2,000\.00/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/Daily amount accumulation/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM1\.00/)).toBeDefined();

    expect(await within(chargeLimitCard).findByText(/Monthly charge limit/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM3,000\.00/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/Monthly amount accumulation/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM2\.00/)).toBeDefined();

    expect(await within(chargeLimitCard).findByText(/Annual charge limit/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM36,000\.00/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/Annual amount accumulation/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM3\.00/)).toBeDefined();

    expect(
      await within(chargeLimitCard).findByText(/Max payment transaction count per day/),
    ).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/10 transactions/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/Daily accumulation/)).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/111 transactions/)).toBeDefined();

    expect(
      await within(chargeLimitCard).findAllByText(/Max payment transaction amount/),
    ).toBeDefined();
    expect(await within(chargeLimitCard).findByText(/RM500\.00/)).toBeDefined();
  });
});
