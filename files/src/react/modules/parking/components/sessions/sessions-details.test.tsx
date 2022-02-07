import * as React from 'react';
import {ParkingSessionDetails} from './sessions-details';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {screen, within} from '@testing-library/react';
import {server} from 'src/react/services/mocks/mock-server';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ParkingSessionDetails/>', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<ParkingSessionDetails id={'01FJV799S8MMC4KJJKG10AR34T'} />);

    const sessionDetail = await screen.findByTestId('session-details-cards');

    expect(sessionDetail).toBeDefined();

    await within(sessionDetail).findByText('01FJV799S8MMC4KJJKG10AR34T');

    expect(within(sessionDetail).getByText('Customer name')).toBeDefined();
    expect(within(sessionDetail).getByText('Parking status')).toBeDefined();
    expect(within(sessionDetail).getByText('Vehicle plate number')).toBeDefined();
    expect(within(sessionDetail).getByText('SETEL1234')).toBeDefined();
  });

  it('renders the duration accordingly', async () => {
    renderWithConfig(<ParkingSessionDetails id={'01FJV799S8MMC4KJJKG10AR34T'} />);

    const sessionDetail = await screen.findByTestId('session-details-cards');

    await within(sessionDetail).findByText('01FJV799S8MMC4KJJKG10AR34T');

    expect(sessionDetail).toBeDefined();

    expect(within(sessionDetail).getByText('about 1 hour'));
  });

  it('opens the edit session modal accordingly', async () => {
    renderWithConfig(<ParkingSessionDetails id={'01FJV799S8MMC4KJJKG10AR34T'} />);

    const button = await screen.findByRole('button', {name: 'EDIT'});

    expect(button).toBeDefined();

    user.click(button);

    const editModal = screen.getByTestId('edit-session-modal');

    expect(within(editModal).getByText('Status')).toBeDefined();
    expect(within(editModal).getByText('Remarks')).toBeDefined();
  });

  it('opens the void session accordingly', async () => {
    renderWithConfig(<ParkingSessionDetails id={'01FJV799S8MMC4KJJKG10AR34T'} />);

    const button = await screen.findByRole('button', {name: 'EDIT'});

    user.click(button);

    const editModal = screen.getByTestId('edit-session-modal');

    const status = within(editModal).getAllByText('Completed')[0];

    expect(status).toBeDefined();

    user.click(status);

    user.click(within(editModal).getByText('Voided'));

    /*
    TODO: Fix dialog tests. Currently the button remains disabled despite selecting voided
     */
    // const confirmButton = within(editModal).getByRole('button', {name: 'SAVE CHANGES'});

    // expect(confirmButton).toBeDefined();
    // expect(confirmButton).not.toBeDisabled();

    // user.click(confirmButton);
    // const voidDialog = await screen.findByTestId('void-session-dialog');

    // expect(voidDialog).toBeDefined();
  });
});
