import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import {ExceptionListing} from './components/exception-listing';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ExceptionTxTable} from './components/exception-tx-table';

jest.setTimeout(60000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ExceptionListing />', () => {
  it('render accordingly after data loaded', async () => {
    renderWithConfig(<ExceptionListing />);
    expect(screen.getAllByText('Created on').length).toEqual(2);
    const exceptions = await screen.findAllByTestId('exception');
    expect(exceptions.length).toBe(50);
  });

  it('filter with merchant name ok', async () => {
    renderWithConfig(<ExceptionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const merchantSearchBox = screen.getAllByPlaceholderText('Search by Merchant ID or Name')[1];
    user.type(merchantSearchBox, 'Christian');
    await screen.findAllByText(/Christian/i);
    user.click(await screen.findByText(/Christian/i, undefined, {timeout: 3000}));
    const exceptions = await screen.findAllByText(/Exception merchant/i, undefined, {
      timeout: 3000,
    });
    expect(exceptions.length).toBe(40);
  });

  it('filter with merchant id ok', async () => {
    renderWithConfig(<ExceptionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const merchantSearchBox = screen.getAllByPlaceholderText('Search by Merchant ID or Name')[1];
    user.type(merchantSearchBox, '60236698fdc64c00179b20a0');
    await screen.findAllByText(/Christian Dior/i, undefined, {timeout: 3000});
    user.click(await screen.findByText(/Christian Dior/i, undefined, {timeout: 3000}));
    const exceptions = await screen.findAllByText(/Exception merchant/i, undefined, {
      timeout: 3000,
    });
    expect(exceptions.length).toBe(40);
  });

  it('filter with batch number ok', async () => {
    renderWithConfig(<ExceptionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const batchIdSearchBox = screen.getAllByPlaceholderText('Select by Batch Number')[1];
    user.type(batchIdSearchBox, 'batch_123');
    expect(batchIdSearchBox).toHaveValue('batch_123');
    user.type(batchIdSearchBox, '{arrowdown}{enter}');
    expect(
      await screen.findAllByText(/Batch_123_Test_Merchant/, undefined, {
        timeout: 3000,
      }),
    ).toHaveLength(40);

    user.clear(batchIdSearchBox);
    expect(batchIdSearchBox).toHaveValue('');
    user.type(batchIdSearchBox, 'batch_vv');
    expect(batchIdSearchBox).toHaveValue('batch_vv');
    user.type(batchIdSearchBox, '{arrowdown}{enter}');

    await screen.findAllByText(/batch_vv/i, undefined, {timeout: 3000});
  });

  it('filter with terminal ok', async () => {
    renderWithConfig(<ExceptionListing />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    const terminalSearchBox = screen.getAllByPlaceholderText('Select by Terminal ID')[1];
    user.type(terminalSearchBox, 'terminal_string{arrowdown}{enter}');
    let exceptions = await screen.findAllByText(/Marry_Test10_Terminal_String/i, undefined, {
      timeout: 3000,
    });
    expect(exceptions.length).toBe(40);
    user.type(terminalSearchBox, `${'{backspace}'.repeat(9)}{arrowdown}{enter}`);
    try {
      await screen.findAllByTestId('exception');
    } catch (e) {
      expect(screen.queryByText(/No data available/i)).toBeDefined();
    }
  });
});

describe('<ExceptionTxTable />', () => {
  it('render successfully', async () => {
    renderWithConfig(<ExceptionTxTable exceptionId="5fd0ab120a5f6800107f9af5" />);
    const exceptionTxRows = await screen.findAllByTestId('exception-tx-row', undefined, {
      timeout: 3000,
    });
    expect(exceptionTxRows.length).toBe(20);
    const exceptionTxsOnlyTerminal = screen.getAllByText(/Records not existed in the host/i);
    const exceptionTxsOnlyPlatform = screen.getAllByText(/Records not existed in the terminal/i);
    const exceptionTxsAmountMismatch = screen.getAllByText(
      /Amount not tally between host and station/i,
    );
    expect(exceptionTxsOnlyTerminal.length).toBe(7);
    expect(exceptionTxsOnlyPlatform.length).toBe(7);
    expect(exceptionTxsAmountMismatch.length).toBe(6);
  });
  it('no data available', async () => {
    renderWithConfig(<ExceptionTxTable exceptionId="5fd0ab120a5f6800107f9af1" />);
    const noDataBanner = await screen.findByText(/No data available/i, undefined, {timeout: 3000});
    expect(noDataBanner).toBeVisible();
  });
});
