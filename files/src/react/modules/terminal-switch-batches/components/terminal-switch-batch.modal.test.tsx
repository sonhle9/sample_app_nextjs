import * as React from 'react';
import {cleanup, screen} from '@testing-library/react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {TerminalSwitchBatchModal} from './terminal-switch-batch.modal';

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

describe('<TerminalSwitchBatchModal />', () => {
  it('should render form and with empty data at start', async () => {
    const batchId = 'PDB1234567889';
    renderWithConfig(
      <TerminalSwitchBatchModal
        visible={true}
        batchId={batchId}
        onClose={() => ''}
        onSuccessUpdate={() => ''}
        typeForceClose={'request'}
      />,
    );

    const remark = (await screen.findByTestId(
      'force-close-approval-remark-type-textarea',
    )) as HTMLTextAreaElement;

    expect(remark.value).toBe('');
  });
});
