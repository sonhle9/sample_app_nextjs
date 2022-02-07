import * as React from 'react';
import user from '@testing-library/user-event';
import {screen, waitFor} from '@testing-library/react';
import {renderWithConfig} from '../../../lib/test-helper';
import {StoreEdit} from './store-edit';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';

describe(`<StoreEdit />`, () => {
  it('should be true', () => {
    expect(1).toBeTruthy();
  });

  const setup = async () => {
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

    renderWithConfig(<StoreEdit storeId={'store-id-1'} />);
    expect(await screen.findByTestId('store-edit-btn')).toBeDefined();
    await waitFor(() =>
      expect((screen.getByTestId('store-edit-btn') as HTMLButtonElement).disabled).toBeFalsy(),
    );
    user.click(await screen.findByTestId('store-edit-btn'));
  };

  it('renders store modal on click', async () => {
    await setup();
    expect(await screen.findByTestId('store-modal')).toBeDefined();
  });

  it('renders confirm status change on deactivate', async () => {
    await setup();
    await waitFor(() =>
      expect((screen.getByTestId('input-status') as HTMLButtonElement).disabled).toBeFalsy(),
    );
    user.click(await screen.findByTestId('input-status'));
    user.click(await screen.findByRole('option', {name: /Inactive/i, hidden: true}));
    user.click(await screen.findByTestId('btn-save'));
    expect(await screen.findByTestId('store-edit-status-confirm-modal')).toBeDefined();
  });

  it('send PUT request on confirm deactivate', async () => {
    let putReq;
    server.use(
      rest.put(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (req, res, ctx) => {
        putReq = req;
        return res(ctx.json({}));
      }),
    );

    await setup();
    await waitFor(() =>
      expect((screen.getByTestId('input-status') as HTMLButtonElement).disabled).toBeFalsy(),
    );
    user.click(await screen.findByTestId('input-status'));
    user.click(await screen.findByRole('option', {name: /Inactive/i, hidden: true}));
    user.click(await screen.findByTestId('btn-save'));
    user.click(await screen.findByTestId('store-edit-status-confirm-btn'));

    expect(await screen.findByText(/Store updated successfully!/));
    expect(putReq).toBeDefined();
  });
});
