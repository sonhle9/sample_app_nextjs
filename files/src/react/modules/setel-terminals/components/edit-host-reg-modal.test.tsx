import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {cleanup, screen} from '@testing-library/react';
import EditHostRegModal from './edit-host-reg-modal';
import {AcquirerType, CardBrand} from '../setel-terminals.const';
import {renderWithConfig} from 'src/react/lib/test-helper';

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

describe('<EditHostRegModal />', () => {
  it('should render form and with appropriate data at start', async () => {
    const serialNum = 'PDB1234567890';
    const hostId = '0987654321';
    const editHostTerminalReg = {
      acquirerType: AcquirerType.MAYBANK,
      cardBrand: [CardBrand.AMERICAN_EXPRESS, CardBrand.MASTER_CARD],
      merchantId: '212121',
      terminalId: '121212',
      batchNum: '1',
      currentStan: 1,
      invoiceNum: 1,
      isEnabled: true,
      _id: '1234567890',
    };

    renderWithConfig(
      <EditHostRegModal
        data={editHostTerminalReg}
        hostId={hostId}
        visible={true}
        serialNum={serialNum}
        onClose={() => ''}
        onSuccessUpdate={() => ''}
      />,
    );

    const acquirerType = (await screen.findByTestId(
      'terminal-host-acquirer-type-input',
    )) as HTMLInputElement;
    const cardBrand = (await screen.findByTestId(
      'terminal-host-card-brand-input',
    )) as HTMLInputElement;
    const merchantId = (await screen.findByTestId(
      'terminal-host-merchant-id-input',
    )) as HTMLInputElement;
    const terminalId = (await screen.findByTestId(
      'terminal-host-terminal-id-input',
    )) as HTMLInputElement;
    const isEnabled = (await screen.findByTestId(
      'terminal-host-is-enabled-input',
    )) as HTMLInputElement;

    expect(acquirerType.value).toBe(undefined);
    expect(cardBrand.value).toBe('');
    expect(merchantId.value).toBe(editHostTerminalReg.merchantId);
    expect(terminalId.value).toBe(editHostTerminalReg.terminalId);
    expect(isEnabled.checked).toBe(editHostTerminalReg.isEnabled);
  });
});
