import {screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchTransactionDetail} from './components/terminal-switch-transaction-detail';
import {TerminalSwitchTransactionListing} from './components/terminal-switch-transaction-listing';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<TerminalSwitchTransactionListing />', () => {
  it('Render correctly with enough data', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getAllByTestId('terminal-switch-transaction-row').length).toBe(20);
    await screen.findByText('DOWNLOAD CSV');
  });
  it('Status filter will work', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const statusFilterBox = (await screen.findAllByTestId('status-filter-box'))[1];
    user.click(statusFilterBox);
    // status=SUCCESS
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
    // status=FAIL
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(1)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00002/, undefined, {timeout: 3000})).length).toEqual(20);
    // status=SUCCESS
    user.type(statusFilterBox, `${'{arrowup}'.repeat(1)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
  });
  it('Type filter will work', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const typeFilterBox = (await screen.findAllByTestId('type-filter-box'))[1];
    user.click(typeFilterBox);
    // type=CHARGE
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
    // type=VOID
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(1)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00002/, undefined, {timeout: 3000})).length).toEqual(20);
    // type=BATCH_UPLOAD
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(1)}{enter}`);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00003/, undefined, {timeout: 3000})).length).toEqual(20);
  });
  it('Merchant filter should work', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    const merchantSearchBox = (
      await screen.findAllByPlaceholderText('Search by Merchant ID or Name')
    )[1];
    // search by merchant name
    user.type(merchantSearchBox, 'AutomationHNFFDWZNJI');
    user.click(await screen.findByText(/AutomationHNFFDWZNJI/, undefined, {timeout: 3000}));
    expect(document.activeElement).toBe(merchantSearchBox);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
    // search by  merchant id
    user.clear(merchantSearchBox);
    await waitFor(() => expect((merchantSearchBox as HTMLInputElement).value).toBe(''));
    user.type(merchantSearchBox, '60236698fdc64c00179b20a0');
    user.click(await screen.findByText(/Christian Dior/, undefined, {timeout: 3000}));
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00002/, undefined, {timeout: 3000})).length).toEqual(20);
  });
  it('Terminal filter should work', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    const terminalSearchBox = (await screen.findAllByPlaceholderText('Search by Terminal ID'))[1];
    // terminalId = 61132b4dc6474691d52e6f4e
    user.type(terminalSearchBox, '61132b4dc6474691d52e6f4e');
    user.click(await screen.findByText(/61132b4dc6474691d52e6f4e/, undefined, {timeout: 3000}));
    expect(document.activeElement).toBe(terminalSearchBox);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
    // terminalId = 61132b57403cdd3fcc8c5718
    user.clear(terminalSearchBox);
    await waitFor(() => expect((terminalSearchBox as HTMLInputElement).value).toBe(''));
    user.type(terminalSearchBox, '61132b57403cdd3fcc8c5718');
    user.click(await screen.findByText(/61132b57403cdd3fcc8c5718/, undefined, {timeout: 3000}));
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00002/, undefined, {timeout: 3000})).length).toEqual(20);
  });
  it('batchNUm filter should work', async () => {
    renderWithConfig(<TerminalSwitchTransactionListing />);
    const batchNumSearchBox = (await screen.findAllByPlaceholderText('Search by Batch ID'))[1];
    // batchNum = 121212
    user.type(batchNumSearchBox, '121212');
    user.click(await screen.findByText(/121212/, undefined, {timeout: 3000}));
    expect(document.activeElement).toBe(batchNumSearchBox);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00001/, undefined, {timeout: 3000})).length).toEqual(20);
    // batchNum = 131313
    user.clear(batchNumSearchBox);
    await waitFor(() => expect((batchNumSearchBox as HTMLInputElement).value).toBe(''));
    user.type(batchNumSearchBox, '131313');
    user.click(await screen.findByText(/131313/, undefined, {timeout: 3000}));
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect((await screen.findAllByText(/00002/, undefined, {timeout: 3000})).length).toEqual(20);
  });
});

describe('<TerminalSwitchTransactionDetail />', () => {
  it('render openLoopCard correct', async () => {
    renderWithConfig(
      <TerminalSwitchTransactionDetail
        transactionId="60b703912c56ed3175eb1c0a"
        onCompletedDisplayedPanCalc={() => {}}
      />,
    );
    await screen.findByText(/JSON/);
    await screen.findByText(/Timeline/);
    expect(
      (await screen.findAllByText('Visa - 461772***3859', undefined, {timeout: 3000})).length,
    ).toEqual(1);
  });
  it('render closeLoopCard correct', async () => {
    renderWithConfig(
      <TerminalSwitchTransactionDetail
        transactionId="60bec966603e60e182ddbb17"
        onCompletedDisplayedPanCalc={() => {}}
      />,
    );
    await screen.findByText(/JSON/);
    await screen.findByText(/Timeline/);
    expect(
      (await screen.findAllByText('Gift - 123123123123', undefined, {timeout: 3000})).length,
    ).toEqual(1);
  });
  it('render if card is null', async () => {
    renderWithConfig(
      <TerminalSwitchTransactionDetail
        transactionId="611b745b4719eead770a7444"
        onCompletedDisplayedPanCalc={() => {}}
      />,
    );
    await screen.findByText(/JSON/);
    await screen.findByText(/Timeline/);
  });
});
