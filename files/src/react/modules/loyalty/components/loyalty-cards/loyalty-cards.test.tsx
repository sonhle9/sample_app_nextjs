import * as React from 'react';
import {screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {LoyaltyCards} from './loyalty-cards';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<LoyaltyCards />', () => {
  it('renders page accordingly', async () => {
    renderWithConfig(<LoyaltyCards />);

    const cards = await screen.findAllByTestId('card-card-number');

    expect(cards.length).toBe(22);
  });
});
