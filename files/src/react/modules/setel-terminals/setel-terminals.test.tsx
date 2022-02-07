import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {TerminalListing} from './components/setel-terminals-listing';
import {cleanup, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {SetelTerminalErrorCodes} from './setel-terminals.const';
import ImportSerialNumberModal from './components/import-serial-number-modal';

jest.setTimeout(100000);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

describe('<TerminalListing />', () => {
  it('render correctly with enough data', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    await waitForElementToBeRemoved(screen.getByTestId('loading-temp-component'));
    expect(screen.getByTestId('setel-terminal-listing-table')).toBeVisible();
  });

  it('merchant filter should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const merchantSearchBox = screen.getAllByTestId('terminal-listing-search-merchantId')[0];

    // search by merchant name
    user.type(merchantSearchBox, 'AutomationHNFFDWZNJI');
    user.click(await screen.findByText(/AutomationHNFFDWZNJI/, undefined, {timeout: 3000}));

    expect(document.activeElement).toBe(merchantSearchBox);
    expect((merchantSearchBox as any).value).toBe('AutomationHNFFDWZNJI');

    // search by merchant id
    user.clear(merchantSearchBox);
    await waitFor(() => expect((merchantSearchBox as HTMLInputElement).value).toBe(''));
    user.type(merchantSearchBox, '60236698fdc64c00179b20a0');
    user.click(await screen.findByText(/Christian Dior/, undefined, {timeout: 3000}));
    expect(
      await screen.findAllByText(/Merchant_Search_By_ID/, undefined, {timeout: 3000}),
    ).toBeDefined();
  });

  it('status filters should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const statusFilterBox = (await screen.findAllByTestId('status-filter-box'))[1];
    // status = CREATED
    user.click(statusFilterBox);
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    expect(await screen.findAllByText(/00000003/, undefined, {timeout: 3000})).toBeDefined();
    // status = ACTIVATED
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(statusFilterBox);
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(3)}{enter}`);
    expect(await screen.findAllByText(/00000001/, undefined, {timeout: 3000})).toBeDefined();
    // status = SUSPENDED
    user.click(screen.getByText(/CLEAR ALL/));
    user.click(statusFilterBox);
    user.type(statusFilterBox, `${'{arrowdown}'.repeat(5)}{enter}`);
    expect(await screen.findAllByText(/PB1239871234/, undefined, {timeout: 3000})).toBeDefined();
  });

  it('type filter should work', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    const typeFilterBox = (await screen.findAllByTestId('type-filter-box'))[1];
    // type=EDC
    user.click(typeFilterBox);
    user.type(typeFilterBox, `${'{arrowdown}'.repeat(2)}{enter}`);
    expect(await screen.findAllByText(/EDC/, undefined, {timeout: 3000})).toBeDefined();
  });

  it('successfully create a new terminal', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);
    // terminal modal must be visible
    user.click(await screen.findByText('CREATE'));
    const terminalModal = await screen.findByTestId('terminal-modal');
    expect(terminalModal).toBeVisible();
    const terminalModalScreen = within(terminalModal);
    // select merchants
    /*
     * since user event is asynchronous,
     * merchant search box could lose focus and reset value due to user event race condition.
     * The simplest solution is to move it to the top and use a waitFor guard to prevent other user interaction
     * until typing to merchant search box completes.
     */
    const merchantSearchBox = terminalModalScreen.getByPlaceholderText('Enter merchant name');
    user.type(merchantSearchBox, 'AutomationOCKUFUCKGJ');

    user.click(
      (await screen.findAllByText(/AutomationOCKUFUCKGJ/, undefined, {timeout: 30000}))[0],
    );

    // input serial number
    const serialNumSearchBox = terminalModalScreen.getByPlaceholderText('Enter serial number');
    user.type(serialNumSearchBox, '{arrowdown}{enter}');
    // user.click(await screen.findByText(/randomSerialNumber2/, undefined, {timeout: 3000})[0]);

    //input remarks
    user.type(terminalModalScreen.getByLabelText('Remarks'), 'Some remarks');

    // click create
    user.click(terminalModalScreen.getByText(/SAVE/));

    // check the success notification
    expect(await screen.findByText(/Create terminal successfully/)).toBeVisible();
    expect(await screen.findByText(/newCreatedSerialNum/)).toBeVisible();
  });

  it('successfully import serial numbers modal', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);

    user.click(await screen.findByText('IMPORT SERIAL NO.'));
    user.click(await screen.findByText('Manual Input'));

    const modal = await screen.findByTestId('import-serial-no-modal');
    expect(modal).toBeVisible();

    const modalScreen = within(modal);
    const serialNumInput = await modalScreen.findByTestId('serial-num-input');

    user.type(serialNumInput, 'serialNo1{enter} serialNo2{enter}');
    expect(await screen.findByText(/serialNo1/, undefined, {timeout: 3000})).toBeVisible();
    expect(await screen.findByText(/serialNo2/, undefined, {timeout: 3000})).toBeVisible();

    user.click(modalScreen.getByText(/CONFIRM/));

    expect(await screen.findByText(/Import serial numbers successfully/)).toBeVisible();
  });

  it('import serial numbers modal should have disabled button if no input', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);

    user.click(await screen.findByText('IMPORT SERIAL NO.'));
    user.click(await screen.findByText('Manual Input'));

    const modal = await screen.findByTestId('import-serial-no-modal');
    expect(modal).toBeVisible();

    const modalScreen = within(modal);
    const confirmBtn = await modalScreen.findByTestId('serial-num-confirm-btn');

    expect(confirmBtn).toBeDisabled();
  });

  it('import serial numbers modal should display alphanumeric error', async () => {
    renderWithConfig(<TerminalListing enabled={true} />);

    user.click(await screen.findByText('IMPORT SERIAL NO.'));
    user.click(await screen.findByText('Manual Input'));

    const modal = await screen.findByTestId('import-serial-no-modal');
    expect(modal).toBeVisible();

    const modalScreen = within(modal);
    const serialNumInput = await modalScreen.findByTestId('serial-num-input');

    user.type(serialNumInput, 'serialNum123{enter}@@@@NotAnAlphanumeric{enter}');
    user.click(modalScreen.getByText(/CONFIRM/));
    expect(await modalScreen.findByText(/Serial number must be alphanumeric/i)).toBeVisible();
  });

  it(
    'import serial numbers modal should display specific error message when api calls failed',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/manual`,
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                errorCode: SetelTerminalErrorCodes.DUPLICATE_KEY,
                message: 'Values already exist in collection ["serialNum123"]',
              }),
            );
          },
        ),
      );

      renderWithConfig(<TerminalListing enabled={true} />);
      user.click(await screen.findByText('IMPORT SERIAL NO.'));
      user.click(await screen.findByText('Manual Input'));
      const modal = await screen.findByTestId('import-serial-no-modal');
      expect(modal).toBeVisible();
      const modalScreen = within(modal);
      const serialNumInput = await modalScreen.findByTestId('serial-num-input');

      user.type(serialNumInput, 'serialNum123{enter}');
      user.click(modalScreen.getByText(/CONFIRM/));

      expect(await modalScreen.findByText(/Serial number already exist/i)).toBeVisible();
    }),
  );

  it(
    'import serial numbers modal should display validation error message',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/manual`,
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                message: [
                  'each value in serialNum must contain only letters and numbers',
                  'each value in serialNum should not be empty',
                ],
              }),
            );
          },
        ),
      );

      renderWithConfig(<TerminalListing enabled={true} />);
      user.click(await screen.findByText('IMPORT SERIAL NO.'));
      user.click(await screen.findByText('Manual Input'));
      const modal = await screen.findByTestId('import-serial-no-modal');
      expect(modal).toBeVisible();
      const modalScreen = within(modal);
      const serialNumInput = await modalScreen.findByTestId('serial-num-input');

      user.type(serialNumInput, 'serialNum123{enter}');
      user.click(modalScreen.getByText(/CONFIRM/));

      expect(
        await modalScreen.findByText(
          /each value in serialNum must contain only letters and numbers/i,
        ),
      ).toBeVisible();
      expect(
        await modalScreen.findByText(/each value in serialNum should not be empty/i),
      ).toBeVisible();
    }),
  );

  it(
    'import serial numbers modal should display unknown error',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/manual`,
          (_, res, ctx) => {
            return res(ctx.status(400));
          },
        ),
      );

      renderWithConfig(
        <ImportSerialNumberModal onSuccessCreate={() => ''} onClose={() => ''} visible={true} />,
      );
      const serialNumInput = await screen.findByTestId('serial-num-input');
      user.type(serialNumInput, 'serialNum123{enter}');
      user.click(screen.getByText(/CONFIRM/));
      expect(await screen.findByText(/Unknown error/i)).toBeVisible();
    }),
  );
});
