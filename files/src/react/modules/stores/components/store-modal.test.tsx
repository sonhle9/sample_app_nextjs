import {screen} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig, suppressConsoleLogs} from '../../../lib/test-helper';
import {StoreModal} from './store-modal';
import {IStore, StoresStatusesEnum} from '../stores.types';

const SAMPLE_STORE: IStore = {
  name: '',
  stationId: '',
  stationName: '',
  merchantId: '',
  status: StoresStatusesEnum.INACTIVE,
};

describe(`<StoreModal />`, () => {
  it('shows all inputs', async () => {
    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );

    expect(await screen.findByTestId('input-name')).toBeDefined();
    expect(await screen.findByTestId('input-stationId')).toBeDefined();
    expect(await screen.findByTestId('input-stationName')).toBeDefined();
    expect(await screen.findByTestId('input-merchantId')).toBeDefined();
    expect(await screen.findByTestId('input-status')).toBeDefined();
  });

  it('validates input name', async () => {
    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const txtName = await screen.findByTestId('input-name');
    user.type(txtName, 'Normal - characters');
    expect(screen.queryByText(/not allowed/i)).toBeNull();
    user.type(txtName, '[[$pecial character$]');
    expect(screen.queryByText(/not allowed/i)).toBeDefined();
  });

  it('validates input stationId', async () => {
    server.use(
      rest.get(`${environment.opsApiBaseUrl}/api/stations/stations/:id`, (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 'abc-123',
            name: 'name',
          }),
        );
      }),
    );

    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const txtStationId = await screen.findByTestId('input-stationId');
    user.type(txtStationId, 'abc-123');
    expect(screen.queryByText(/Store not found/i)).toBeNull();
  });

  it(
    'unsuccessfully validates input stationId',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(`${environment.opsApiBaseUrl}/api/stations/stations/:id`, (_, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              message: 'Store not found',
            }),
          );
        }),
      );
      renderWithConfig(
        <StoreModal
          header={'Test modal'}
          initialValues={SAMPLE_STORE}
          isLoading={false}
          error={''}
          onSave={() => {}}
          onDismiss={() => {}}
        />,
      );
      const txtStationId = await screen.findByTestId('input-stationId');
      user.type(txtStationId, 'def-456');
      expect(screen.queryByText(/Store not found/i)).toBeDefined();
    }),
  );

  it('automates input stationName', async () => {
    server.use(
      rest.get(`${environment.opsApiBaseUrl}/api/stations/stations/:id`, (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 'abc-123',
            name: 'name-123',
          }),
        );
      }),
    );
    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const txtStationId = await screen.findByTestId('input-stationId');
    user.type(txtStationId, 'abc-123');
    const txtStationName = await screen.findByDisplayValue('name-123');
    expect(txtStationName).toBeDefined();
  });

  it('validates input merchantId', async () => {
    server.use(
      rest.get(
        `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/:id`,
        (_, res, ctx) => {
          return res(
            ctx.status(201),
            ctx.json({
              merchantId: 'def-456',
            }),
          );
        },
      ),
    );

    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const txtMerchantId = await screen.findByTestId('input-merchantId');
    user.type(txtMerchantId, 'def-456');
    expect(screen.queryByText(/Store not found/i)).toBeNull();
  });

  it(
    'validates input merchantId',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(
          `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/:id`,
          (_, res, ctx) => {
            return res(
              ctx.status(404),
              ctx.json({
                message: 'Merchant not found',
              }),
            );
          },
        ),
      );

      renderWithConfig(
        <StoreModal
          header={'Test modal'}
          initialValues={SAMPLE_STORE}
          isLoading={false}
          error={''}
          onSave={() => {}}
          onDismiss={() => {}}
        />,
      );
      const txtMerchantId = await screen.findByTestId('input-merchantId');
      user.type(txtMerchantId, 'ghi-789');
      expect(screen.queryByText(/Store not found/i)).toBeDefined();
    }),
  );

  it('can disable status', async () => {
    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={''}
        fieldProps={{status: {disabled: true}}}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const ddStatus = await screen.findByTestId('input-status');
    expect((ddStatus as HTMLButtonElement).getAttribute('aria-disabled')).toBe('true');
  });

  it('shows error', async () => {
    renderWithConfig(
      <StoreModal
        header={'Test modal'}
        initialValues={SAMPLE_STORE}
        isLoading={false}
        error={'This is error message'}
        onSave={() => {}}
        onDismiss={() => {}}
      />,
    );
    const txtError = await screen.findByText('This is error message');
    expect(txtError).toBeDefined();
  });
});
