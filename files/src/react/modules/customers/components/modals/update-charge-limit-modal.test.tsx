import {screen} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {keyBy} from 'lodash';

import {server} from 'src/react/services/mocks/mock-server';
import {customerAccumulations} from 'src/react/services/mocks/api-blacklist.service.mock';
import {renderWithConfig} from 'src/react/lib/test-helper';

import {UpdateChargeLimitModal} from './update-charge-limit-modal';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`UpdateChargeLimitModal`, () => {
  it('should render modal', async () => {
    renderWithConfig(
      <UpdateChargeLimitModal
        customerId="customerId"
        data={keyBy(customerAccumulations, (item) => item.type.toLowerCase()) as any}
        onDismiss={() => {}}
      />,
    );

    expect(await screen.findByText(/Daily charge limit/)).toBeDefined();
    expect(await screen.findByDisplayValue('2,000')).toBeDefined();
    expect(await screen.findByText(/Daily amount accumulation/)).toBeDefined();
    expect(await screen.findByDisplayValue('1')).toBeDefined();

    expect(await screen.findByText(/Monthly charge limit/)).toBeDefined();
    expect(await screen.findByDisplayValue('3,000')).toBeDefined();
    expect(await screen.findByText(/Monthly amount accumulation/)).toBeDefined();
    expect(await screen.findByDisplayValue('2')).toBeDefined();

    expect(await screen.findByText(/Annual charge limit/)).toBeDefined();
    expect(await screen.findByDisplayValue(/36,000/)).toBeDefined();
    expect(await screen.findByText(/Annual amount accumulation/)).toBeDefined();
    expect(await screen.findByDisplayValue('3')).toBeDefined();

    expect(await screen.findByText(/Max transaction count per day/)).toBeDefined();
    expect(await screen.findByDisplayValue('10')).toBeDefined();
    expect(await screen.findByText(/Daily accumulation/)).toBeDefined();
    expect(await screen.findByDisplayValue('111')).toBeDefined();

    expect(await screen.findAllByText(/Max payment transaction amount/)).toBeDefined();
    expect(await screen.findByDisplayValue('500')).toBeDefined();
    user.click(await screen.findByTestId('submit-btn'));
    expect(await screen.findByText(/Are you sure want to change the limits\?/)).toBeDefined();
  });
});
