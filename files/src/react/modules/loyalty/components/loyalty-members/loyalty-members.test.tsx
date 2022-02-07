import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {LoyaltyMembers} from './loyalty-members';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyMembers />', () => {
  it('renders page accordingly', () => {
    renderWithConfig(<LoyaltyMembers />);

    expect(screen.queryAllByTestId('id-type').length).toBe(1);
    expect(screen.queryAllByTestId('search-input').length).toBe(1);
  });

  it('renders accordingly when data is received', async () => {
    renderWithConfig(<LoyaltyMembers />);

    const searchCard = await screen.findByTestId('search-card');

    expect(searchCard).toBeDefined();

    expect(within(searchCard).getByTestId('id-type')).toBeDefined();

    user.click(within(searchCard).getByTestId('id-type'));

    user.click(screen.getByText('Mesra card number'));

    user.type(screen.getByTestId('search-input'), '70838156123322811');

    user.click(screen.getByRole('button', {name: /Search/i}));

    const results = await screen.findAllByTestId('members-row');

    expect(results.length).toBe(1);
  });
});
