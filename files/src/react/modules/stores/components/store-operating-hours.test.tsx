import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig} from '../../../lib/test-helper';
import {StoreOperatingHours} from './store-operating-hours';
import {IStore, StoresStatusesEnum} from '../stores.types';
import {retailRoles} from 'src/shared/helpers/roles.type';

const SAMPLE_STORE: IStore = {
  name: '',
  stationId: 'abc-123',
  stationName: '',
  merchantId: '',
  status: StoresStatusesEnum.INACTIVE,
  operatingHours: [],
};

describe(`<StoreOperatingHours />`, () => {
  const renderConfig = {permissions: [retailRoles.storeCreate, retailRoles.storeUpdate]};

  it('shows empty state', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(ctx.json(SAMPLE_STORE));
      }),
    );

    renderWithConfig(<StoreOperatingHours storeId={'abc-123'} />, renderConfig);

    expect(await screen.findByText(/You have not added operating hours yet/i)).toBeDefined();
    expect(await screen.findByText(/Add Hours/i)).toBeDefined();
  });

  it('shows day and time', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [
              {
                day: 1,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 2,
                timeSlots: [{from: 0, to: 720}],
              },
            ],
          }),
        );
      }),
    );

    renderWithConfig(<StoreOperatingHours storeId={'abc-456'} />, renderConfig);

    expect(await screen.findByText(/24 hours/i)).toBeDefined();
    expect(await screen.findByText(/12:00 AM - 12:00 PM/i)).toBeDefined();
  });

  it('shows everyday', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [
              {
                day: 1,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 2,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 3,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 4,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 5,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 6,
                timeSlots: [{from: 0, to: 1439}],
              },
              {
                day: 0,
                timeSlots: [{from: 0, to: 1439}],
              },
            ],
          }),
        );
      }),
    );
    renderWithConfig(<StoreOperatingHours storeId={'abc-789'} />, renderConfig);

    expect(await screen.findByText(/Everyday/i)).toBeDefined();
    expect(await screen.findByText(/24 hours/i)).toBeDefined();
  });

  it('shows edit modal', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [
              {
                day: 1,
                timeSlots: [{from: 0, to: 1439}],
              },
            ],
          }),
        );
      }),
    );

    renderWithConfig(<StoreOperatingHours storeId={'abc-012'} />, renderConfig);

    user.click(await screen.findByText(/EDIT/i));

    expect(await screen.findByText(/SAVE CHANGES/i)).toBeDefined();
  });

  it('edit modal can apply 24 hours and activate new store', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [],
            status: StoresStatusesEnum.ACTIVE,
          }),
        );
      }),
    );

    server.use(
      rest.put(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) =>
        res(ctx.status(201), ctx.json(SAMPLE_STORE)),
      ),
    );
    renderWithConfig(<StoreOperatingHours storeId={'abc-345'} />, renderConfig);

    user.click(await screen.findByText(/ADD HOURS/i));
    await screen.findByText(/SAVE CHANGES/i);
    user.click(await screen.findByLabelText(/24 hours/i));

    const $saveBtn = screen.getByText(/SAVE CHANGES/i);

    user.click($saveBtn);

    await waitForElementToBeRemoved($saveBtn);
  });

  it('edit modal keeps original status if operating hours was previously set', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [
              {
                day: 1,
                timeSlots: [
                  {
                    from: 0,
                    to: 600,
                  },
                ],
              },
            ],
            status: StoresStatusesEnum.INACTIVE,
          }),
        );
      }),
    );

    server.use(
      rest.put(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) =>
        res(ctx.status(201), ctx.json(SAMPLE_STORE)),
      ),
    );

    renderWithConfig(<StoreOperatingHours storeId={'abc-345'} />, renderConfig);

    user.click(await screen.findByText(/EDIT/i));
    await screen.findByText(/SAVE CHANGES/i);
    user.click(await screen.findByLabelText(/24 hours/i));

    const $saveBtn = screen.getByText(/SAVE CHANGES/i);

    user.click($saveBtn);

    await waitForElementToBeRemoved($saveBtn);
  });

  it('edit modal can add slot', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
        return res(
          ctx.json({
            ...SAMPLE_STORE,
            operatingHours: [],
          }),
        );
      }),
    );

    renderWithConfig(<StoreOperatingHours storeId={'abc-678'} />, renderConfig);

    user.click(await screen.findByText(/ADD HOURS/i));
    await screen.findByText(/SAVE CHANGES/i);

    const [addSlot] = await screen.findAllByText(/\+ ADD SLOT/);
    user.click(addSlot);
    expect(screen.getByTestId('slot-from-time')).toBeDefined();
    expect(screen.getByTestId('slot-to-time')).toBeDefined();
  });
});
