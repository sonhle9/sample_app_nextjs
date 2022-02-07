import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {cleanup, screen} from '@testing-library/react';
import {EntryModes, ITerminal} from 'src/react/services/api-terminal.type';
import {TerminalStatus, TerminalType} from '../setel-terminals.const';
import TerminalEditPasscodeModal from './edit-passcode-modal';

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

describe('<TerminalEditPasscodeModal />', () => {
  it('should show merchant and admin passcode', async () => {
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

    renderWithConfig(
      <TerminalEditPasscodeModal
        visible={true}
        terminal={terminal}
        onClose={() => ''}
        onSuccessUpdate={() => ''}
      />,
    );

    const checkbox = (await screen.findByTestId('merchant-pass-checkbox')) as HTMLInputElement;
    expect(checkbox.checked).toEqual(true);
    expect(screen.getByDisplayValue(/111111/)).toBeDefined();
    expect(screen.getByDisplayValue(/1222222/)).toBeDefined();
  });

  it('should only show admin passcode', async () => {
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
        isEnabled: false,
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

    renderWithConfig(
      <TerminalEditPasscodeModal
        visible={true}
        terminal={terminal}
        onClose={() => ''}
        onSuccessUpdate={() => ''}
      />,
    );

    const checkbox = (await screen.findByTestId('merchant-pass-checkbox')) as HTMLInputElement;
    const merchantPassInput = (await screen.findByTestId(
      'merchant-pass-input',
    )) as HTMLInputElement;

    expect(checkbox.checked).toEqual(false);
    expect(merchantPassInput.value).toEqual('-');
    expect(screen.getByDisplayValue(/111111/)).toBeDefined();
  });
});
