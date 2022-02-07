import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import user from '@testing-library/user-event';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {MOCK_FUEL_ORDER_DETAILS} from '../../../services/mocks/api-orders.service.mock';
import {FuelOrdersDetails} from './fuel-orders-details';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<FuelOrdersDetails />', () => {
  it('displays details', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    expect(await screen.findByText('Payment transactions')).toBeVisible();
    await screen.findAllByText('Transaction ID');

    expect(await screen.findByText('Loyalty transactions')).toBeVisible();
    expect(
      screen.queryByText('Order does not have any loyalty transactions'),
    ).not.toBeInTheDocument();

    expect(screen.getByText('Order JSON')).toBeVisible();
    expect(screen.getByText('Payment authorized amount')).toBeVisible();
  });

  it('navigates to customer details page', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(screen.getByTestId('navigate-to-customer-page'));
  });

  it('navigates to stations details page', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);

    user.click(screen.getByTestId('navigate-to-stations-page'));
  });

  it('navigates to payment transactions page', async () => {
    render();

    expect(await screen.findByText('Payment transactions')).toBeVisible();
    await screen.findAllByText('Transaction ID');

    const links = await screen.findAllByTestId('navigate-to-payments-transactions-page');
    expect(links.length).toBeTruthy();
  });

  it('manually release an order', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(screen.getByText('MANUAL RELEASE'));
    expect(await screen.findByTestId('Manual release order modal')).toBeVisible();

    user.click(await screen.findByText('CONFIRM'));

    expect(await screen.findByText(/This order has been released and cancelled./i)).toBeVisible();
  });

  it('cancels preauth amount', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(await screen.findByRole('button', {name: 'ACTIONS', hidden: true}));

    user.click(await screen.findByText('Cancel authorize'));
    expect(await screen.findByLabelText('Cancel authorize')).toBeVisible();

    user.click(screen.getByText('CONTINUE'));

    expect(await screen.findByTestId('Confirm cancel authorize modal')).toBeVisible();

    user.click(screen.getByText('SUBMIT'));

    expect(await screen.findByText(/Successfully canceled pre-authorized amount./i)).toBeVisible();
  });

  it('manual charge', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(await screen.findByRole('button', {name: 'ACTIONS', hidden: true}));

    user.click(await screen.findByText('Charge by invoice'));
    expect(await screen.findByLabelText('Charge by invoice')).toBeVisible();

    user.click(screen.getByText('CONTINUE'));

    expect(await screen.findByTestId('Confirm charge by invoice modal')).toBeVisible();

    user.click(screen.getByText('SUBMIT'));

    expect(await screen.findByText(/Successfully charged manually./i)).toBeVisible();
  });

  it.skip('manual charge with generated invoice', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(await screen.findByRole('button', {name: 'ACTIONS', hidden: true}));

    user.click(await screen.findByText('Generate invoice and charge'));
    expect(await screen.findByLabelText('Generate invoice and charge')).toBeVisible();

    userEvent.type(await screen.findByTestId('completedAmountInput'), '12');

    const fuelTypeInput = screen.getByTestId('fuelTypeInput');
    user.click(fuelTypeInput);

    expect(await screen.findByRole('listbox')).toBeVisible();
    user.click(await screen.findByText('Primax 95'));

    user.click(screen.getByText('SUBMIT'));

    expect(
      await screen.findByText(/Successfully charged manually by generated invoice./i),
    ).toBeVisible();
  });

  it('edit tags', async () => {
    render();

    expect(await screen.findByText('Order details')).toBeVisible();
    await screen.findAllByText(MOCK_FUEL_ORDER_DETAILS.orderId);
    expect(await screen.findByText('Megatest')).toBeVisible();

    user.click(await screen.findByRole('button', {name: 'EDIT TAGS', hidden: true}));

    const editTagsModal = await screen.findByLabelText('Edit tags');

    expect(editTagsModal).toBeVisible();

    const tag = within(editTagsModal).getByText('recovery-fulfill-confirmation-lost-failed');

    expect(tag).toBeVisible();

    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/Successfully edited tags./i)).toBeVisible();
  });
});

function render() {
  renderWithConfig(<FuelOrdersDetails orderId={MOCK_FUEL_ORDER_DETAILS.orderId} />);
}
