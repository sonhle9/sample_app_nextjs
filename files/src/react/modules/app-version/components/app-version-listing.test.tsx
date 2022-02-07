import {screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {AppVersionListing} from './app-version-listing';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AppVersionListing', () => {
  it('works', async () => {
    renderWithConfig(<AppVersionListing />);
    (await screen.findAllByText('android')).forEach((item) => {
      expect(item).toBeVisible();
    });

    user.click(screen.getByText('CREATE'));

    const withinModal = within(screen.getByRole('dialog'));

    user.type(withinModal.getByLabelText('Version'), '1.1.1');
    user.click(withinModal.getByText('Select date'));
    user.click(screen.getByText('2'));
    user.click(withinModal.getByTestId('platform'));
    user.click(screen.getByRole('option', {name: 'Android', hidden: true}));
    user.click(withinModal.getByTestId('status'));
    user.click(screen.getByRole('option', {name: 'Active', hidden: true}));
    user.click(withinModal.getByText('SAVE'));

    user.click(screen.getAllByText('DELETE')[0]);
    const $confirmDeleteBtn = within(screen.getByRole('alertdialog')).getByText('DELETE');

    user.click($confirmDeleteBtn);

    await waitForElementToBeRemoved($confirmDeleteBtn);
  });
});
