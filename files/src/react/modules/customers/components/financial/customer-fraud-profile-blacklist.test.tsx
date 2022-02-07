import {screen, within} from '@testing-library/dom';
import {getByText, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import {server} from '../../../../services/mocks/mock-server';
import * as React from 'react';
import {renderWithConfig} from '../../../../lib/test-helper';
import {CustomerFraudProfileBlacklist} from './customer-fraud-profile-blacklist';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerFraudProfileBlacklist`, () => {
  it('renders user fraud profile - not found', async () => {
    renderWithConfig(
      <CustomerFraudProfileBlacklist userId={'adaae01a-8421-49f5-9c24-b91d815cddfa'} />,
    );

    const blacklistCard = await screen.findByTestId('expand-blacklist');
    user.click(await within(blacklistCard).findByRole('button', {expanded: false}));

    expect(await screen.findAllByText(/Blacklist/)).toBeDefined();
    expect(screen.getByText('ADD')).toBeDefined();
  });
  it('renders user fraud profile - found', async () => {
    renderWithConfig(
      <CustomerFraudProfileBlacklist userId={'0d7c3353-ed38-4f72-9e67-81f0efc0d9ec'} />,
    );

    const blacklistCard = await screen.findByTestId('expand-blacklist');
    user.click(await within(blacklistCard).findByRole('button', {expanded: false}));

    expect(await screen.findAllByText(/Blacklist/)).toBeDefined();

    await waitFor(
      async () => {
        expect(screen.getByText('EDIT')).toBeDefined();
      },
      {timeout: 2000},
    );
    expect(await screen.findByText(/Remarks/)).toBeDefined();
    expect(await screen.findByText(/High risk for number of devices linked/)).toBeDefined();
  });
  it('renders user fraud profile', async () => {
    const watchListedUserId = '3d0bc295-87fe-4676-bca0-d130e1feb958';
    renderWithConfig(<CustomerFraudProfileBlacklist userId={watchListedUserId} />);

    const blacklistCard = await screen.findByTestId('expand-blacklist');
    user.click(await within(blacklistCard).findByRole('button', {expanded: false}));

    expect(await screen.findAllByText(/Blacklist/)).toBeDefined();
    await waitFor(
      async () => {
        expect(screen.getByText('EDIT')).toBeDefined();
      },
      {timeout: 2000},
    );

    expect(await screen.findByText(/Wallet top-up/)).toBeDefined();
    expect(await screen.findByText(/Wallet charge/)).toBeDefined();

    const updateButton = await screen.findByTestId(/add-blacklist-button/);
    user.click(updateButton);
    expect(await screen.findByTestId(/edit-fraud-profile-popup/i)).toBeDefined();

    const editProfilePopup = await screen.findByTestId(/edit-fraud-profile-popup/i);
    expect(getByText(editProfilePopup, 'Status')).toBeDefined();
    expect(getByText(editProfilePopup, 'Restrictions')).toBeDefined();
    expect(getByText(editProfilePopup, 'Remarks')).toBeDefined();

    expect(await screen.findByTestId(/fraud-profile-submit-button/i)).toBeDefined();
    const editProfileButton = await screen.findByTestId(/fraud-profile-submit-button/i);
    user.click(editProfileButton);
    await waitForElementToBeRemoved(await screen.findByTestId(/edit-fraud-profile-popup/i), {
      timeout: 2000,
    });
  });
});
