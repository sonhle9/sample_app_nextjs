import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {cleanup, screen, waitFor, within} from '@testing-library/react';
import TerminalEditModal from './edit-terminal-modal';
import {EntryModes, ITerminal} from 'src/react/services/api-terminal.type';
import {TerminalStatus, TerminalType} from '../setel-terminals.const';
import user from '@testing-library/user-event';
import {apiClient} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {rest} from 'msw';

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

const terminalsBaseUrl = `${environment.setelTerminalApiBaseUrl}/api/terminal`;

describe('<TerminalEditModal />', () => {
  const terminal: ITerminal = {
    terminalId: '10000109',
    status: 'DEPLOYED',
    type: TerminalType.EDC,
    serialNum: 'SERIALNUM01',
    modelReference: 'p2',
    manufacturer: 'sunmi',
    merchantId: 'merchant-id',
    merchantName: 'merchantName',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    remarks: 'testing remarks',
    timeline: [{status: TerminalStatus.DEPLOYED, date: new Date()}],
    adminPass: '111111',
    merchantPass: {
      value: '1222222',
      isEnabled: true,
    },
    allowedEntryModes: [EntryModes.SWIPE, EntryModes.SWIPE, EntryModes.CONTACTLESS],
    myDebitOptIn: true,
    terminalMenu: {
      isChargeEnabled: true,
      isCheckBalanceEnabled: true,
      isSettingsEnabled: true,
      isSettlementEnabled: true,
      isSmartpaySaleEnabled: true,
      isTmsFunctionsEnabled: true,
      isTopUpEnabled: true,
      isTransactionEnabled: true,
    },
  };
  const merchantName = 'merchantName';
  const merchantAddress = 'merchantAddress';

  it('should display correct data', async () => {
    renderWithConfig(
      <TerminalEditModal
        visible={true}
        terminal={terminal}
        merchantName={merchantName}
        merchantAddress={merchantAddress}
        onClose={() => {}}
        onSuccessUpdate={() => {}}
      />,
    );

    expect(screen.queryByTestId('reason-input')).toBeNull();
    expect(screen.getByDisplayValue(/10000109/)).toBeDefined();
    expect(screen.getAllByText(/Deployed/)).toBeDefined();
    expect(screen.getAllByText(/EDC/)).toBeDefined();
    expect(screen.getByDisplayValue(/SERIALNUM01/)).toBeDefined();
    expect(screen.getByDisplayValue(/sunmi/)).toBeDefined();
    expect(screen.getByDisplayValue(/p2/)).toBeDefined();
    expect(screen.getByDisplayValue(/merchantName/)).toBeDefined();
    expect(screen.getByDisplayValue(/merchantAddress/)).toBeDefined();
    expect(screen.getByDisplayValue(/testing remarks/)).toBeDefined();
  });
  it('should render reason input if SUSPENDED is selected', () => {
    renderWithConfig(
      <TerminalEditModal
        visible={true}
        terminal={{...terminal, status: 'DEPLOYED'}}
        merchantName={merchantName}
        merchantAddress={merchantAddress}
        onClose={() => {}}
        onSuccessUpdate={() => {}}
      />,
    );

    expect(screen.queryByTestId('reason-input')).toBeDefined();
  });

  it('should trigger deactivation endpoint on status DEACTIVATED', async () => {
    server.use(
      rest.get(
        `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin/settlements/pending`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json({isOpenBatch: false, isPendingSettlement: false}));
        },
      ),
    );
    const apiClientGetSpy = jest.spyOn(apiClient, 'get');
    const apiClientPutSpy = jest.spyOn(apiClient, 'put');

    renderWithConfig(
      <TerminalEditModal
        visible={true}
        terminal={{...terminal, status: 'DEACTIVATED', reason: 'testing reason'}}
        merchantName={merchantName}
        merchantAddress={merchantAddress}
        onClose={() => {}}
        onSuccessUpdate={() => {}}
      />,
    );

    await waitFor(() => expect(apiClientGetSpy).toHaveBeenCalled());

    user.click(screen.getByText(/SAVE CHANGES/));

    const deactivationDialog = await screen.findByTestId('terminal-deactivation-dialog');
    expect(deactivationDialog).toBeVisible();
    const deactivationDialogScreen = within(deactivationDialog);

    user.click(deactivationDialogScreen.getByText(/DEACTIVATE/));

    expect(screen.queryByTestId('edit-terminal-alert')).toBeNull();

    await waitFor(() =>
      expect(apiClientPutSpy).toHaveBeenCalledWith(
        `${terminalsBaseUrl}/terminals/deactivate/${terminal.serialNum}`,
        {
          reason: 'testing reason',
        },
      ),
    );
  });

  it('should show alert error on pending settlement', async () => {
    server.use(
      rest.get(
        `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin/settlements/pending`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json({isOpenBatch: true, isPendingSettlement: false}));
        },
      ),
    );
    const apiClientGetSpy = jest.spyOn(apiClient, 'get');

    renderWithConfig(
      <TerminalEditModal
        visible={true}
        terminal={{...terminal, status: 'DEACTIVATED', reason: 'testing reason'}}
        merchantName={merchantName}
        merchantAddress={merchantAddress}
        onClose={() => {}}
        onSuccessUpdate={() => {}}
      />,
    );

    await waitFor(() => expect(apiClientGetSpy).toHaveBeenCalled());

    user.click(screen.getByText(/SAVE CHANGES/));

    const deactivationDialog = await screen.findByTestId('terminal-deactivation-dialog');
    expect(deactivationDialog).toBeVisible();
    const deactivationDialogScreen = within(deactivationDialog);

    user.click(deactivationDialogScreen.getByText(/DEACTIVATE/));

    const alert = screen.queryByTestId('edit-terminal-alert');
    expect(screen.queryByTestId('edit-terminal-alert')).toBeDefined();

    expect(alert.textContent).toEqual('Please clear the pending settlement and open batches.');
  });

  it(
    'should display error at edit terminal modal on unknown error',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(
          `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin/settlements/pending`,
          (_, res, ctx) => {
            return res(ctx.status(400), ctx.json({}));
          },
        ),
      );

      renderWithConfig(
        <TerminalEditModal
          visible={true}
          terminal={{...terminal, status: 'DEACTIVATED', reason: 'testing reason'}}
          merchantName={merchantName}
          merchantAddress={merchantAddress}
          onClose={() => {}}
          onSuccessUpdate={() => {}}
        />,
      );

      user.click(screen.getByText(/SAVE CHANGES/));

      const deactivationDialog = await screen.findByTestId('terminal-deactivation-dialog');
      expect(deactivationDialog).toBeVisible();
      const deactivationDialogScreen = within(deactivationDialog);

      user.click(deactivationDialogScreen.getByText(/DEACTIVATE/));

      expect(screen.queryByTestId('edit-terminal-alert')).toBeVisible();

      expect(
        screen.getByText('Unable to check pending settlement, please try again.'),
      ).toBeVisible();
      expect(await screen.findByText('Request failed with status code 400')).toBeVisible();
    }),
  );
});
