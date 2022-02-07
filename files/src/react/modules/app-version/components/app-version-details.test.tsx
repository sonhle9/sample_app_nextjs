import {screen, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {AppVersionDetails} from './app-version-details';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AppVersionDetails', () => {
  it('works', async () => {
    renderWithConfig(<AppVersionDetails id="5d14cf1d7c2a77623c9b2220" />);

    expect(await screen.findByText('Sunsetted')).toBeVisible();

    user.click(screen.getByText('EDIT'));

    const withinModal = within(screen.getByRole('dialog'));

    user.clear(withinModal.getByLabelText('Version'));
    user.keyboard('2.3.0');

    const $saveBtn = withinModal.getByText('SAVE');

    user.click($saveBtn);

    await waitForElementToBeRemoved($saveBtn);
  });
});
