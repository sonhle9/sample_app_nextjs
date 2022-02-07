import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {Cashflows} from './cashflows';

import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`<Cashflows />`, () => {
  it('renders with detail cashflow', async () => {
    renderWithConfig(<Cashflows />);
    const recordsAdjustCollection = await screen.findByTestId('adjust-collection-account');
    expect(recordsAdjustCollection).toBeDefined();

    // Hide the edit button adjust balance on trust for 1.68
    const recordsAdjustTrustAccount = await screen.findByTestId('adjust-trust-account');
    expect(recordsAdjustTrustAccount).toBeDefined();

    const recordsTransferToOperatingAccount = await screen.findByTestId(
      'transfer-to-operating-account',
    );
    expect(recordsTransferToOperatingAccount).toBeDefined();

    const recordsAdjustOperatingAccount = await screen.findByTestId('adjust-operating-account');
    expect(recordsAdjustOperatingAccount).toBeDefined();

    expect(screen.getByText('RM 62,835.81'));
    expect(screen.getByText('RM 130,044,498.08'));
  });

  it('render Adjust Collection Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('adjust-collection-account'));
    expect(screen.getByText('Available balance adjustment value'));
  });

  // Hide the edit button adjust balance on trust for 1.68
  it('render Adjust Trust Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('adjust-trust-account'));
    expect(screen.getByText('Buffer balance adjustment value'));
  });

  it('render Transfer to Operating Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('transfer-to-operating-account'));
    expect(screen.getByText('Transfer amount'));
  });

  it('render Adjust Operating Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('adjust-operating-account'));
    expect(screen.getByText('Operating account adjustment value'));
  });

  it('Submit Adjust Collection Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('adjust-collection-account'));

    user.click(screen.getByTestId('submit-adjust-collection'));
    const textError = screen.queryByText('Number must is not equal 0');
    expect(textError).toBeNull();
  });

  it('Submit Adjust Trust Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('adjust-trust-account'));

    user.click(screen.getByTestId('submit-adjust-trust-account'));
    const textError = screen.queryByText('Number must is not equal 0');
    expect(textError).toBeNull();
  });

  it('Submit Adjust Collection Account', async () => {
    renderWithConfig(<Cashflows />);
    user.click(screen.getByTestId('transfer-to-operating-account'));

    user.click(screen.getByTestId('submit-transfer-to-operating-account'));
    const textError = screen.queryByText('Number must is not equal 0');
    expect(textError).toBeNull();
  });
});
