import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {cleanup, screen} from '@testing-library/react';
import AddHostRegModal from './add-host-reg-modal';
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

describe('<AddHostRegModal />', () => {
  it('should render form and with empty data at start', async () => {
    const serialNum = 'PDB1234567890';

    renderWithConfig(
      <AddHostRegModal
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

    expect(acquirerType.value).toBe(undefined);
    expect(cardBrand.value).toBe('');
    expect(merchantId.value).toBe('');
    expect(terminalId.value).toBe('');
  });
});
