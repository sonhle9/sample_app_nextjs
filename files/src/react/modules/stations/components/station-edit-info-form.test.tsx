import * as React from 'react';
import {screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {StationEditInfoForm} from './station-edit-info-form';
import {
  IIndexStation,
  IReadStation,
  StationSetelAcceptedFor,
  StationStatus,
  StationStoreStatus,
} from 'src/shared/interfaces/station.interface';
import {ConciergeStatus, FuelInCarStatus} from 'src/app/stations/shared/const-var';
import * as stationService from 'src/react/services/api-stations.service';

const mockedStation: IIndexStation = {
  id: 'RYB0010',
  setelAcceptedFor: [StationSetelAcceptedFor.FUEL, StationSetelAcceptedFor.STORE],
  name: 'PETRONAS Damansara Jaya 2',
  address: 'LOT 10068, JALAN SS 22/48, DAMANSARA, PETALING JAYA, SG, 47400',
  latitude: 3.121275,
  longitude: 101.618529,
  isActive: true,
  status: StationStatus.ACTIVE,
  features: [
    {
      featureItems: [
        'setel_services_fuel_purchase',
        'setel_services_mesra_store_purchase',
        'setel_services_concierge',
      ],
      typeId: 'setel_services',
    },
    {
      featureItems: [
        'facilities_atm',
        'facilities_toilets',
        'facilities_surau',
        'facilities_baby_change',
        'facilities_epayment',
        'facilities_grab_mesra_pitstop',
        'facilities_grab_rewards',
        'facilities_car_spa',
      ],
      typeId: 'facilities',
    },
    {
      featureItems: [
        'fuel_primax_95',
        'fuel_primax_97',
        'fuel_dynamic_diesel',
        'fuel_euro_5_diesel',
      ],
      typeId: 'fuel',
    },
    {
      featureItems: [
        'fnb_dunkin_donuts',
        'fnb_kfc',
        'fnb_mcdonalds',
        'fnb_anw',
        'fnb_subway',
        'fnb_burger_king',
        'fnb_hot_n_roll',
        'fnb_starbucks',
        'fnb_morning_mesra',
        'fnb_tealive',
      ],
      typeId: 'fnb',
    },
  ],
  storeStatus: StationStoreStatus.ACTIVE,
  fuelInCarOperatingHours: [],
  fuelInCarStatus: FuelInCarStatus.comingsoon,
  operatingHours: [
    {
      day: 0,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 1,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 2,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 3,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 4,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 5,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
    {
      day: 6,
      timeSlots: [
        {
          from: 480,
          to: 1200,
        },
      ],
    },
  ],
  conciergeStatus: ConciergeStatus.active,
  vendorType: 'sapura',
  vendor: {
    status: '',
    updateAt: new Date(),
  },
  healthCheck: {
    status: 'active',
    updateAt: new Date(),
  },
};

describe('<StationEditInfoForm />', () => {
  const onDismiss = jest.fn();

  it('submit form with vendor type and station status', async () => {
    const updateStationBasicDetails = jest
      .spyOn(stationService, 'updateStationBasicDetails')
      .mockResolvedValue({} as IReadStation);

    renderWithConfig(<StationEditInfoForm current={mockedStation} onDismiss={onDismiss} />);

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);

    const expectedUpdateArguments = {
      status: mockedStation.status,
      vendorType: mockedStation.vendorType,
    };

    const successNotification = await screen.findByText(/RYB0010 updated./i);
    expect(updateStationBasicDetails).toHaveBeenCalledWith(
      mockedStation.id,
      expectedUpdateArguments,
    );
    expect(successNotification).toBeDefined();
    expect(onDismiss).toBeCalled();
  });
});
