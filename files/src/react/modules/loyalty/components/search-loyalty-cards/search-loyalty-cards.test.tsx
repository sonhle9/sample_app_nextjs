import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {SearchLoyaltyCards} from './search-loyalty-cards';
import user from '@testing-library/user-event';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<SearchLoyaltyCards />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<SearchLoyaltyCards />);

    user.click(screen.getByText('Please select'));

    expect(screen.getByText('IC number')).toBeDefined();
    expect(screen.getByText('IC number (Old)')).toBeDefined();
    expect(screen.getByText('Passport number')).toBeDefined();

    user.click(screen.getByText('Passport number'));

    expect(screen.getByTestId('search-input')).toBeDefined();
    user.type(screen.getByTestId('search-input'), 'A');
    user.click(screen.getByRole('button', {name: /Search/i}));

    const cards = await screen.findAllByTestId('card-row');

    expect(cards.length).toBe(35);
  });
});
