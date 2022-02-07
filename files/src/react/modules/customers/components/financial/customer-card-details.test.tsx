import {screen} from '@testing-library/dom';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {CustomerCardDetails} from './customer-card-details';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`CustomerCardDetails`, () => {
  it('render customer card details', async () => {
    renderWithConfig(<CustomerCardDetails />);
    expect(await screen.findByText('Customer Card Details')).toBeDefined();
    expect(await screen.findByTestId('customer-card-details-json')).toBeDefined();
  });
});
