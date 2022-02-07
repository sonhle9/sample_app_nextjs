import {screen, within} from '@testing-library/react';
import * as React from 'react';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {stations} from '../../../services/mocks/api-stations.service.mock';
import {StationDetails} from './station-details';
import user from '@testing-library/user-event';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<StationDetails />', () => {
  it('displays details', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    const statusRows = await screen.findByTestId('status-rows');
    expect(statusRows.childNodes.length).toBe(4);

    const operatingHoursRows = await screen.findByTestId('operating-hours-rows');
    expect(operatingHoursRows.childNodes.length).toBe(1);

    const pumpStatusRows = await screen.findByTestId('pump-status-rows');
    expect(pumpStatusRows.childNodes.length).toBe(stations[0].pumps.length);

    const featuresRows = await screen.findByTestId('features-rows');
    expect(featuresRows.childNodes.length).toBe(stations[0].features.length);
  });

  it('edit station basic details', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-station-details'));

    expect(await screen.findByLabelText('Edit details')).toBeVisible();
    user.type(screen.getByTestId('edit-latitude'), '111.00');

    user.click(screen.getByText('SAVE CHANGES'));
    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit station status', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-station-status'));

    expect(await screen.findByLabelText('Edit status')).toBeVisible();
    expect(screen.getByText('Station status')).toBeVisible();

    user.click(screen.getByLabelText('Active'));
    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit store status', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-store-status'));

    expect(await screen.findByLabelText('Edit status')).toBeVisible();
    expect(screen.getByText('Store status')).toBeVisible();

    user.click(screen.getByLabelText('Active'));
    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit Concierge status', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-concierge-status'));

    expect(await screen.findByLabelText('Edit status')).toBeVisible();
    expect(screen.getByText('Concierge status')).toBeVisible();

    user.click(screen.getByLabelText('Active'));
    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit 24-hour operating hours', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-operating-hours'));

    expect(await screen.findByLabelText('Edit station operating hours')).toBeVisible();
    expect(screen.getByText('Operating hours')).toBeVisible();

    user.click(screen.getByLabelText('24 hours - Everyday'));
    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit custom operating hours', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-operating-hours'));

    expect(await screen.findByLabelText('Edit station operating hours')).toBeVisible();
    expect(screen.getByText('Operating hours')).toBeVisible();

    user.click(screen.getByLabelText('Custom'));

    const customOperatingHoursContainer = await screen.findByLabelText('operatingHours');
    expect(customOperatingHoursContainer.childNodes.length).toBe(stations[0].operatingHours.length);

    const sunday = screen.getAllByTestId('edit-operating-hour-day')[0];
    user.click(within(sunday).getByLabelText('Custom hours'));
    user.click(within(sunday).getByText('Add time'));

    const sundayTimeslots = await screen.findByLabelText('operatingHours.0.timeSlots');
    expect(sundayTimeslots.childNodes.length).toBe(3);

    user.click(screen.getByText('SAVE CHANGES'));
  });

  it('edit 24-hour operating hours', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-operating-hours'));

    expect(await screen.findByLabelText('Edit station operating hours')).toBeVisible();
    expect(screen.getByText('Operating hours')).toBeVisible();

    user.click(screen.getByLabelText('24 hours - Everyday'));
    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit pump status', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-pump-status'));

    expect(await screen.findByLabelText('Edit pump status')).toBeVisible();

    const pumps = await screen.findByTestId('edit-pump-status-rows');
    expect(pumps.childNodes.length).toBe(stations[0].pumps.length);

    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });

  it('edit features', async () => {
    render();

    const stationName = await screen.findAllByText(stations[0].name);
    expect(stationName.length).toBeTruthy();

    user.click(await screen.findByTestId('edit-features'));

    expect(await screen.findByLabelText('Edit features')).toBeVisible();

    expect(screen.getAllByText('Facilities')[1]).toBeVisible();
    expect(screen.getAllByText('Food and Beverage')[1]).toBeVisible();
    expect(screen.getAllByText('Fuel Type')[1]).toBeVisible();
    expect(screen.getAllByText('Setel Services')[1]).toBeVisible();

    user.click(screen.getByText('SAVE CHANGES'));

    expect(await screen.findByText(/You have successfully updated the details./i)).toBeVisible();
  });
});

function render() {
  renderWithConfig(<StationDetails stationId={stations[0].id} />);
}
