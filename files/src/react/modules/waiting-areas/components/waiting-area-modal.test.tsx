import {screen} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig, suppressConsoleLogs} from '../../../lib/test-helper';
import {WaitingAreaModal} from './waiting-area-modal';

describe(`<WaitingAreaModal />`, () => {
  it('shows all inputs', async () => {
    renderWithConfig(<WaitingAreaModal isOpen={true} onDismiss={() => {}} />);

    expect(await screen.findByTestId('input-name')).toBeDefined();
    expect(await screen.findByTestId('input-nameLocale-ms')).toBeDefined();
    expect(await screen.findByTestId('input-nameLocale-zh-Hans')).toBeDefined();
    expect(await screen.findByTestId('input-nameLocale-zh-Hant')).toBeDefined();
    expect(await screen.findByTestId('input-nameLocale-ta')).toBeDefined();
    expect(await screen.findByTestId('input-latitude')).toBeDefined();
    expect(await screen.findByTestId('input-longitude')).toBeDefined();
    expect(await screen.findByTestId('input-tags')).toBeDefined();
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

    renderWithConfig(<WaitingAreaModal isOpen={true} onDismiss={() => {}} />);
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
      renderWithConfig(<WaitingAreaModal isOpen={true} onDismiss={() => {}} />);
      const txtStationId = await screen.findByTestId('input-stationId');
      user.type(txtStationId, 'def-456');
      expect(screen.queryByText(/Store not found/i)).toBeDefined();
    }),
  );

  it('automates input latitude, longitude, tags', async () => {
    server.use(
      rest.get(`${environment.opsApiBaseUrl}/api/stations/stations/:id`, (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 'abc-123',
            name: 'name-123',
            latitude: 1.2345,
            longitude: 6.789,
          }),
        );
      }),
    );
    renderWithConfig(<WaitingAreaModal isOpen={true} onDismiss={() => {}} />);
    const txtStationId = await screen.findByTestId('input-stationId');
    user.type(txtStationId, 'abc-123');
    const txtLatitude = await screen.findByDisplayValue(1.2345);
    expect(txtLatitude).toBeDefined();
    const txtLongitude = await screen.findByDisplayValue(1.2345);
    expect(txtLongitude).toBeDefined();
    const txtTagId = await screen.findByText('abc-123');
    expect(txtTagId).toBeDefined();
    const txtTagName = await screen.findByText('name-123');
    expect(txtTagName).toBeDefined();
  });

  it('validates form', async () => {
    renderWithConfig(<WaitingAreaModal isOpen={true} onDismiss={() => {}} />);

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);

    expect((await screen.findAllByText(/Required/i)).length).toBeGreaterThan(0);
  });
});
