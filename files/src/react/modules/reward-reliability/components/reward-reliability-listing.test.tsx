import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {RewardReliabilityListing} from './reward-reliability-listing';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RewardReliabilityListing', () => {
  it('works', async () => {
    renderWithConfig(<RewardReliabilityListing />);

    expect(await screen.findByText(/api-rewards/i)).toBeVisible();
    expect(screen.getByText(/129 \/ 130/i)).toBeVisible();
    const retriggerButton = screen.getByRole('button', {name: /retrigger/i});
    expect(retriggerButton).toBeDisabled();

    user.click(screen.getByDisplayValue(/apiPayments/i));
    expect(await screen.findByText(/createwallet/i)).toBeVisible();

    user.click(retriggerButton);
    expect(await screen.findByText(/successfully/i)).toBeVisible();
  });
});
