import * as React from 'react';
import {server} from 'src/react/services/mocks/mock-server';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {cleanup, screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import TerminalInventoryEditSerialNumberModal from './inventory-edit-serial-number-modal';
import {ITerminalInventory} from 'src/react/services/api-terminal.type';
import {TerminalStatus} from '../setel-terminals.const';
import {apiClient} from 'src/react/lib/ajax';
jest.setTimeout(100000);
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  server.resetHandlers();
});

afterAll(() => server.close());

describe('<TerminalInventoryEditSerialNumberModal />', () => {
  it('should submit data to api', async () => {
    server.use(
      rest.put(
        `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/serialNumTest`,
        (_, res, ctx) => {
          return res(
            ctx.json({
              status: TerminalStatus.NEW,
              serialNum: 'updatedSerialNumTest',
              terminalId: 'terminalId',
              createdAt: new Date().toISOString(),
            }),
          );
        },
      ),
    );

    const apiClientPutSpy = jest.spyOn(apiClient, 'put');

    const terminal: ITerminalInventory = {
      status: TerminalStatus.NEW,
      serialNum: 'serialNumTest',
      terminalId: 'terminalId',
      createdAt: new Date().toISOString(),
    };

    renderWithConfig(
      <TerminalInventoryEditSerialNumberModal
        isVisible={true}
        terminal={terminal}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
    );

    const serialNumInput = screen.getByTestId('serial-number-input');
    user.clear(serialNumInput);
    user.type(serialNumInput, 'updatedSerialNumTest');

    const submitButton = screen.getByText(/SAVE/);

    await waitFor(() => user.click(submitButton));

    expect(apiClientPutSpy).toHaveBeenCalledWith(
      `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/serialNumTest`,
      {
        serialNum: 'updatedSerialNumTest',
      },
    );
  });

  it('should show helpText error - serial number must be alphanumeric', async () => {
    const terminal: ITerminalInventory = {
      status: TerminalStatus.NEW,
      serialNum: 'serialNumTest@@',
      terminalId: 'terminalId',
      createdAt: new Date().toISOString(),
    };

    renderWithConfig(
      <TerminalInventoryEditSerialNumberModal
        isVisible={true}
        terminal={terminal}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
    );
    const submitButton = screen.getByText(/SAVE/);

    expect(await screen.findByText(/Serial number must be alphanumeric/)).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('should show helpText error - serial number is required', async () => {
    const terminal: ITerminalInventory = {
      status: TerminalStatus.NEW,
      serialNum: '',
      terminalId: 'terminalId',
      createdAt: new Date().toISOString(),
    };

    renderWithConfig(
      <TerminalInventoryEditSerialNumberModal
        isVisible={true}
        terminal={terminal}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
    );
    const submitButton = screen.getByText(/SAVE/);

    expect(await screen.findByText(/Serial number is required/)).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it(
    'should show helpText error - serial number already exist',
    suppressConsoleLogs(async () => {
      server.use(
        rest.put(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/duplicateSerialNumTest`,
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                errorCode: '9606113',
              }),
            );
          },
        ),
      );
      const apiClientPutSpy = jest.spyOn(apiClient, 'put');

      const terminal: ITerminalInventory = {
        status: TerminalStatus.NEW,
        serialNum: 'duplicateSerialNumTest',
        terminalId: 'terminalId',
        createdAt: new Date().toISOString(),
      };

      renderWithConfig(
        <TerminalInventoryEditSerialNumberModal
          isVisible={true}
          terminal={terminal}
          onClose={() => {}}
          onSuccess={() => {}}
        />,
      );
      const submitButton = screen.getByText(/SAVE/);

      await waitFor(() => {
        user.click(submitButton);
      });

      await waitFor(() =>
        expect(apiClientPutSpy).toHaveBeenCalledWith(
          `${environment.setelTerminalApiBaseUrl}/api/terminal/admin/inventory/duplicateSerialNumTest`,
          {
            serialNum: 'duplicateSerialNumTest',
          },
        ),
      );

      expect(await screen.findByText(/Serial number already exist/)).toBeVisible();
      expect(submitButton).toBeDisabled();
    }),
  );
});
