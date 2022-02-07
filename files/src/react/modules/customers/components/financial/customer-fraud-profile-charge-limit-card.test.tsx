import {screen, within} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {keyBy, chain} from 'lodash';

import {CustomerFraudProfileChargeLimitCard} from './customer-fraud-profile-charge-limit-card';

import {server} from 'src/react/services/mocks/mock-server';
import {customerAccumulations} from 'src/react/services/mocks/api-blacklist.service.mock';

import {renderWithConfig} from 'src/react/lib/test-helper';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const getCustomerAccumulation = (userId): any =>
  chain(customerAccumulations)
    .filter(['userId', userId])
    .keyBy((item) => item.type.toLowerCase())
    .valueOf();

describe(`CustomerFraudProfileChargeLimitCard`, () => {
  it('should render charge limit card', async () => {
    renderWithConfig(
      <CustomerFraudProfileChargeLimitCard
        data={keyBy(customerAccumulations, (item) => item.type.toLowerCase()) as any}
        customerId="3d0bc295-87fe-4676-bca0-d130e1feb958"
        isLoading={false}
      />,
    );

    const chargeLimitCard = await screen.findByTestId('charge-limit-card');
    user.click(await within(chargeLimitCard).findByRole('button', {expanded: false}));

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

  it('should render SUPPORTED device', async () => {
    renderWithConfig(
      <CustomerFraudProfileChargeLimitCard
        data={getCustomerAccumulation('adaae01a-8421-49f5-9c24-b91d815cddfa')}
        customerId="adaae01a-8421-49f5-9c24-b91d815cddfa"
        isLoading={false}
      />,
    );

    const badge = await screen.findByTestId('supported-device-info');
    expect(badge).toHaveClass('pu-text-success-700');
    expect(badge.innerHTML).toEqual('SUPPORTED');
  });

  it('should render UNSUPPORTED device', async () => {
    renderWithConfig(
      <CustomerFraudProfileChargeLimitCard
        data={getCustomerAccumulation('adaae01a-8421-49f5-9c24-b91d815cddfb')}
        customerId="adaae01a-8421-49f5-9c24-b91d815cddfb"
        isLoading={false}
      />,
    );

    const badge = await screen.findByTestId('supported-device-info');
    expect(badge).toHaveClass('pu-text-mediumgrey');
    expect(badge.innerHTML).toEqual('UNSUPPORTED');
  });

  it('should render update modal', async () => {
    renderWithConfig(
      <CustomerFraudProfileChargeLimitCard
        data={keyBy(customerAccumulations, (item) => item.type.toLowerCase()) as any}
        customerId="3d0bc295-87fe-4676-bca0-d130e1feb958"
        isLoading={false}
      />,
    );

    const chargeLimitCard = await screen.findByTestId('charge-limit-card');
    user.click(await within(chargeLimitCard).findByRole('button', {expanded: false}));

    await waitFor(
      async () => {
        expect(
          await within(chargeLimitCard).findByTestId('edit-charge-limit-button'),
        ).toBeVisible();
      },
      {timeout: 2000},
    );

    user.click(await within(chargeLimitCard).findByTestId('edit-charge-limit-button'));
    expect(await screen.findByTestId('customer-update-charge-limit-modal')).toBeDefined();
  });
});
