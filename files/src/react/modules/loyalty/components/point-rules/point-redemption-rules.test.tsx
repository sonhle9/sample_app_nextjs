import * as React from 'react';
import {screen, within, cleanup} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {PointRedemptionRules} from './point-redemption-rules';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`<PointRedemptionRules />`, () => {
  afterEach(() => {
    cleanup();
  });

  const buttonGroupHelper = () => {
    const leftButton = screen.getByTestId('button-group-left');

    const rightButton = screen.getByTestId('button-group-right');

    return {leftButton, rightButton};
  };

  it('renders accordingly when no data is received', async () => {
    renderWithConfig(<PointRedemptionRules />);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();
  });

  it('renders accordingly when data is received', async () => {
    renderWithConfig(<PointRedemptionRules />);

    const redemptions = await screen.findAllByTestId('redemption-entry');
    expect(redemptions.length).toBe(3);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();
  });

  it('renders accordingly when reorder button is pressed', async () => {
    renderWithConfig(<PointRedemptionRules />);

    const redemptions = await screen.findAllByTestId('redemption-entry');
    expect(redemptions.length).toBe(3);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();

    user.click(leftButton);

    expect(within(leftButton).getByText('CANCEL')).toBeDefined();
    expect(within(rightButton).getByText('SAVE CHANGES')).toBeDefined();
  });

  it('renders create modal accordingly', async () => {
    renderWithConfig(<PointRedemptionRules />);

    const {rightButton} = buttonGroupHelper();

    user.click(rightButton);

    const createFields = await screen.findByTestId('create-update-fields');

    expect(within(createFields).getByText('Priority')).toBeDefined();
    expect(within(createFields).getByText('Source')).toBeDefined();
    expect(within(createFields).getByText('Target type')).toBeDefined();
    expect(within(createFields).getByText('Target')).toBeDefined();
    expect(within(createFields).getByText('Rate')).toBeDefined();
    expect(within(createFields).getByText('Start date')).toBeDefined();
    expect(within(createFields).getByText('End date')).toBeDefined();
    expect(within(createFields).getByText('Remarks')).toBeDefined();
  });
});
