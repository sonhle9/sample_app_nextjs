import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import user from '@testing-library/user-event';
import {PointEarningRules} from './point-earning-rules';
import {server} from 'src/react/services/mocks/mock-server';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`<PointEarningRules />`, () => {
  const buttonGroupHelper = () => {
    const leftButton = screen.getByTestId('button-group-left');

    const rightButton = screen.getByTestId('button-group-right');

    return {leftButton, rightButton};
  };

  it('renders accordingly when no data is received', async () => {
    renderWithConfig(<PointEarningRules />);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();
  });

  it('renders accordingly when data is received', async () => {
    renderWithConfig(<PointEarningRules />);

    const earnings = await screen.findAllByTestId('earning-entry');
    expect(earnings.length).toBe(3);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();
  });

  it('renders accordingly when reorder button is pressed', async () => {
    renderWithConfig(<PointEarningRules />);

    const earnings = await screen.findAllByTestId('earning-entry');
    expect(earnings.length).toBe(3);

    const {leftButton, rightButton} = buttonGroupHelper();

    expect(within(leftButton).getByText('RE-ORDER')).toBeDefined();
    expect(within(rightButton).getByText('CREATE')).toBeDefined();

    user.click(leftButton);

    expect(within(leftButton).getByText('CANCEL')).toBeDefined();
    expect(within(rightButton).getByText('SAVE CHANGES')).toBeDefined();
  });

  it('renders create modal accordingly', async () => {
    renderWithConfig(<PointEarningRules />);

    const {rightButton} = buttonGroupHelper();

    user.click(rightButton);

    const createFields = await screen.findByTestId('create-update-fields');

    expect(within(createFields).getByText('Priority')).toBeDefined();
    expect(within(createFields).getByText('Name')).toBeDefined();
    expect(within(createFields).getByText('Card groups')).toBeDefined();
    expect(within(createFields).getByText('Loyalty categories')).toBeDefined();
    expect(within(createFields).getByText('Source type')).toBeDefined();
    expect(within(createFields).getByText('Source')).toBeDefined();
    expect(within(createFields).getByText('Target type')).toBeDefined();
    expect(within(createFields).getByText('Target')).toBeDefined();
    expect(within(createFields).getByText('Rate')).toBeDefined();
    expect(within(createFields).getByText('Start date')).toBeDefined();
    expect(within(createFields).getByText('End date')).toBeDefined();
    expect(within(createFields).getByText('Remarks')).toBeDefined();
  });
});
