import {formatDateUtc} from '@setel/portal-ui';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createMockData,
  createPaginationHandler,
  createDetailHandler,
  createFixResponseHandler,
} from 'src/react/lib/mock-helper';

const pumps = createMockData(
  [
    {
      isAvailable: true,
      isReserved: false,
      isInUse: false,
      fuelOptions: [
        {
          isAvailable: true,
          mesraCode: '0103',
          grade: 'DIESEL',
          price: 2.18,
          taxCode: 'TR',
          taxPercentage: 0,
          taxAmount: 0,
        },
        {
          isAvailable: true,
          mesraCode: '0106',
          grade: 'PRIMAX 95',
          price: 1.98,
          taxCode: 'TR',
          taxPercentage: 0,
          taxAmount: 0,
        },
        {
          isAvailable: true,
          mesraCode: '0107',
          grade: 'PRIMAX 97',
          price: 1.98,
          taxCode: 'TR',
          taxPercentage: 0,
          taxAmount: 0,
        },
        {
          isAvailable: true,
          mesraCode: '0108',
          grade: 'EURO5',
          price: 2.28,
          taxCode: 'T6',
          taxPercentage: 0,
          taxAmount: 0,
        },
      ],
      status: 'active',
      pumpId: '1',
      stationId: '492',
      lastReservedAt: '2018-10-25T20:05:29.000Z',
    },
  ],
  5,
  (seed, index) => ({
    ...seed,
    pumpId: `${index}`,
    status: index === 3 ? 'maintenance' : index % 2 === 0 ? 'active' : 'inactive',
  }),
);

export const stations = createMockData(
  [
    {
      id: 'RYW1175',
      merchant: {
        gstNumber: null,
        merchantId: null,
        phoneNumber: '',
        retailerNumber: 'RYW1175',
        tradingCompanyName: 'SJ TRADE BERKAT',
      },
      pumps,
      setelAcceptedFor: ['fuel', 'store'],
      name: 'PETRONAS Salak Jaya SB',
      address: 'LOT KM 13.8, LEBUH RAYA SUNGAI BESI (ARAH SELATAN), , KL, ',
      latitude: 3.09072,
      longitude: 101.70076,
      status: 'active',
      isActive: true,
      updatedAt: '2021-01-13T06:27:26.336Z',
      features: [
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
            'fnb_dunkin_donuts',
            'fnb_kfc',
            'fnb_mcdonalds',
            'fnb_anw',
            'fnb_subway',
            'fnb_burger_king',
            'fnb_hot_n_roll',
            'fnb_starbucks',
          ],
          typeId: 'fnb',
        },
        {
          featureItems: ['setel_services_concierge'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'inactive',
      fuelInCarOperatingHours: [
        {
          day: 0,
          timeSlots: [
            {
              from: 540,
              to: 1020,
            },
          ],
        },
        {
          day: 1,
          timeSlots: [
            {
              from: 540,
              to: 1020,
            },
          ],
        },
        {
          day: 4,
          timeSlots: [
            {
              from: 540,
              to: 1380,
            },
          ],
        },
        {
          day: 6,
          timeSlots: [
            {
              from: 360,
              to: 1140,
            },
            {
              from: 540,
              to: 1020,
            },
            {
              from: 1200,
              to: 1260,
            },
          ],
        },
      ],
      fuelInCarStatus: 'active',
      operatingHours: [
        {
          day: 0,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 1,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 2,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 3,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 4,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 5,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 6,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
      ],
      conciergeStatus: 'inactive',
      vendorType: 'setel',
      merchantId: '19',
      kipleMerchantId: '19',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.284Z',
      },
      fuelMerchantId: '60236698fdc64c00179b20a0',
      storeMerchantId: '60236698fdc64c00179b20a0',
      isOperating24Hours: true,
    },
    {
      id: 'RYW1259',
      merchant: {
        gstNumber: null,
        merchantId: null,
        phoneNumber: '',
        retailerNumber: 'RYW1259',
        tradingCompanyName: 'SJ TRADE BERKAT',
      },
      pumps,
      setelAcceptedFor: ['fuel', 'store'],
      name: 'PETRONAS Batu 5 Gombak',
      address: 'LOT 30217 PM 906, LOT 30504 GM 2291,, SETAPAK, KL, 53000',
      latitude: 3.212697,
      longitude: 101.708571,
      isActive: true,
      status: 'active',
      updatedAt: '2021-01-13T06:53:25.445Z',
      features: [
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
        {
          featureItems: ['setel_services_fuel_purchase'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'coming-soon',
      fuelInCarOperatingHours: [],
      fuelInCarStatus: 'coming-soon',
      operatingHours: [
        {
          day: 0,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 1,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 2,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 3,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 4,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 5,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 6,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
      ],
      conciergeStatus: 'active',
      vendorType: 'sapura',
      merchantId: '20',
      kipleMerchantId: '20',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.285Z',
      },
    },
    {
      id: 'RYW1166',
      merchant: {
        gstNumber: null,
        merchantId: null,
        phoneNumber: '',
        retailerNumber: 'RYW1166',
        tradingCompanyName: 'SJ TRADE BERKAT',
      },
      pumps,
      setelAcceptedFor: ['fuel', 'store'],
      updatedAt: '2020-12-14T10:01:05.435Z',
      name: 'PETRONAS KM2.95 Penchala Link (Arah Damansara)',
      address: 'KM2.95 WILAYAH PERSEKUTUAN KUALA LUMPUR PENCHALA LINK DAMANSARA, , SG, ',
      latitude: 3.1600831,
      longitude: 101.6133492,
      isActive: true,
      status: 'active',
      features: [
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
            'fnb_dunkin_donuts',
            'fnb_kfc',
            'fnb_mcdonalds',
            'fnb_anw',
            'fnb_subway',
            'fnb_burger_king',
            'fnb_hot_n_roll',
            'fnb_starbucks',
            'fnb_morning_mesra',
          ],
          typeId: 'fnb',
        },
        {
          featureItems: ['setel_services_fuel_purchase', 'setel_services_mesra_store_purchase'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'coming-soon',
      fuelInCarOperatingHours: [],
      fuelInCarStatus: 'coming-soon',
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
      conciergeStatus: 'coming-soon',
      vendorType: 'sapura',
      merchantId: '21',
      kipleMerchantId: '21',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.285Z',
      },
    },
    {
      id: 'RYW1139',
      merchant: {
        gstNumber: null,
        merchantId: null,
        phoneNumber: '',
        retailerNumber: 'RYW1139',
        tradingCompanyName: 'SJ TRADE BERKAT',
      },
      pumps,
      setelAcceptedFor: ['fuel', 'store', 'kiosk'],
      name: 'PETRONAS PUTRA BESTARI DEV RYW',
      address: 'LOT PT NO.3612 HS (D) 108483 PUTRA HEIGHTS SUBANG JAYA, SUBANG JAYA, SG, 47620',
      latitude: 3.16081,
      longitude: 101.61455,
      isActive: false,
      status: 'inactive',
      updatedAt: '2020-12-31T04:36:51.984Z',
      features: [
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
            'facilities_atm',
            'facilities_toilets',
            'facilities_surau',
            'facilities_baby_change',
            'facilities_epayment',
            'facilities_grab_mesra_pitstop',
            'facilities_grab_rewards',
            'facilities_bus_tickets',
            'facilities_car_spa',
          ],
          typeId: 'facilities',
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
        {
          featureItems: ['setel_services_fuel_purchase', 'setel_services_mesra_store_purchase'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'active',
      fuelInCarOperatingHours: [
        {
          day: 1,
          timeSlots: [
            {
              from: 540,
              to: 1440,
            },
          ],
        },
        {
          day: 2,
          timeSlots: [
            {
              from: 540,
              to: 1020,
            },
          ],
        },
        {
          day: 3,
          timeSlots: [
            {
              from: 570,
              to: 1260,
            },
          ],
        },
        {
          day: 4,
          timeSlots: [
            {
              from: 720,
              to: 1200,
            },
          ],
        },
        {
          day: 5,
          timeSlots: [
            {
              from: 0,
              to: 1260,
            },
          ],
        },
      ],
      fuelInCarStatus: 'active',
      operatingHours: [
        {
          day: 0,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 1,
          timeSlots: [
            {
              from: 660,
              to: 1380,
            },
          ],
        },
        {
          day: 2,
          timeSlots: [
            {
              from: 0,
              to: 900,
            },
          ],
        },
        {
          day: 3,
          timeSlots: [
            {
              from: 600,
              to: 960,
            },
          ],
        },
        {
          day: 4,
          timeSlots: [
            {
              from: 600,
              to: 1380,
            },
          ],
        },
        {
          day: 5,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
        {
          day: 6,
          timeSlots: [
            {
              from: 0,
              to: 1440,
            },
          ],
        },
      ],
      conciergeStatus: 'active',
      vendorType: 'sapura',
      merchantId: '22',
      kipleMerchantId: '22',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.284Z',
      },
    },
    {
      id: 'RYW1130',
      merchant: {
        gstNumber: null,
        merchantId: null,
        phoneNumber: '',
        retailerNumber: 'RYW1130',
        tradingCompanyName: 'SJ TRADE BERKAT',
      },
      pumps,
      setelAcceptedFor: ['fuel'],
      name: 'PETRONAS  Putrajaya Precint 18',
      address:
        'LOT PT 12850 HS(D) 8220 PRECINT 18, BANDAR & DAERAH PUTRAJAYA, PUTRAJAYA, KL, 62100',
      latitude: 2.920361,
      longitude: 101.694932,
      isActive: true,
      status: 'active',
      updatedAt: '2021-01-13T07:02:18.350Z',
      features: [
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
            'fnb_dunkin_donuts',
            'fnb_kfc',
            'fnb_mcdonalds',
            'fnb_anw',
            'fnb_subway',
            'fnb_burger_king',
            'fnb_hot_n_roll',
            'fnb_starbucks',
          ],
          typeId: 'fnb',
        },
        {
          featureItems: ['setel_services_fuel_purchase'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'coming-soon',
      fuelInCarOperatingHours: [],
      fuelInCarStatus: 'coming-soon',
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
      conciergeStatus: 'active',
      vendorType: 'sapura',
      merchantId: '23',
      kipleMerchantId: '23',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.285Z',
      },
    },
    {
      id: 'RYB1100',
      setelAcceptedFor: ['fuel'],
      name: 'PETRONAS SKVE',
      address: 'HSM NO. 12810, PT NO. 20188, AIR HITAM PUCHONG, DENGKIL, , SG, 62502',
      latitude: 2.97334,
      longitude: 101.674504,
      isActive: true,
      pumps,
      status: 'active',
      updatedAt: '2020-12-14T10:01:06.705Z',
      features: [
        {
          featureItems: [
            'facilities_setel_enabled',
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
            'fnb_dunkin_donuts',
            'fnb_kfc',
            'fnb_mcdonalds',
            'fnb_anw',
            'fnb_subway',
            'fnb_burger_king',
            'fnb_hot_n_roll',
            'fnb_starbucks',
          ],
          typeId: 'fnb',
        },
        {
          featureItems: [
            'fuel_primax_95',
            'fuel_primax_97',
            'fuel_dynamic_diesel',
            'fuel_euro_5_diesel',
            'fuel_ngv',
          ],
          typeId: 'fuel',
        },
        {
          featureItems: ['setel_services_fuel_purchase'],
          typeId: 'setel_services',
        },
        {
          featureItems: [],
          typeId: 'setel_services_1',
        },
      ],
      storeStatus: 'coming-soon',
      fuelInCarOperatingHours: [],
      fuelInCarStatus: 'coming-soon',
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
      conciergeStatus: 'coming-soon',
      vendorType: 'sapura',
      merchantId: '19',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'active',
        updatedAt: '2020-02-28T17:07:10.285Z',
      },
    },
    {
      id: 'RYW0013',
      setelAcceptedFor: ['fuel'],
      name: 'PETRONAS Sri Sentosa',
      address: 'LOT PT 737, TAMAN SRI SENTOSA OFF JALAN KLANG LAMA, KUALA LUMPUR, KL, 58000',
      latitude: 46.445887,
      longitude: 30.758689,
      pumps,
      isActive: true,
      status: 'active',
      updatedAt: '2021-04-05T02:16:21.850Z',
      features: [
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
            'fnb_dunkin_donuts',
            'fnb_kfc',
            'fnb_mcdonalds',
            'fnb_anw',
            'fnb_subway',
            'fnb_burger_king',
            'fnb_hot_n_roll',
            'fnb_starbucks',
          ],
          typeId: 'fnb',
        },
        {
          featureItems: ['setel_services_fuel_purchase'],
          typeId: 'setel_services',
        },
      ],
      storeStatus: 'active',
      fuelInCarOperatingHours: [],
      fuelInCarStatus: 'active',
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
      conciergeStatus: 'active',
      vendorType: 'sapura',
      merchantId: '19',
      loyaltyVendorMerchantId: '',
      healthCheck: {
        status: 'inactive',
        updatedAt: '2020-02-28T17:07:10.285Z',
      },
    },
  ],
  75,
  (seed, index) => ({
    ...seed,
    id: `${seed.id}${index}`,
    name: `${seed.name} - (Mock ${index})`,
  }),
);

const baseUrl = `${environment.stationsApiBaseUrl}/api/stations`;

export const handlers = [
  rest.get(`${baseUrl}/stations`, createPaginationHandler(stations)),
  rest.get(`${baseUrl}/stations/:id`, createDetailHandler(stations, 'id')),
  rest.put(`${baseUrl}/administration/stations/:id`, (req, res, ctx) => {
    const station = stations.find((st) => st.id === req.params.id);

    if (!station) {
      return res(ctx.status(404));
    }

    station.updatedAt = formatDateUtc(new Date());

    Object.keys(req.body).forEach((key) => {
      station[key] = req.body[key];
    });

    return res(ctx.json(station));
  }),
  rest.patch(`${baseUrl}/administration/stations/:id`, (req, res, ctx) => {
    const station = stations.find((st) => st.id === req.params.id);

    if (!station) {
      return res(ctx.status(404));
    }

    station.updatedAt = formatDateUtc(new Date());

    Object.keys(req.body).forEach((key) => {
      station[key] = req.body[key];
    });

    return res(ctx.json(station));
  }),
  rest.get(
    `${baseUrl}/stations/feature/types`,
    createFixResponseHandler([
      {
        typeId: 'fuel',
        name: 'Fuel Type',
        features: [
          {id: 'fuel_primax_95', name: 'PETRONAS Primax 95 with Pro-Drive'},
          {id: 'fuel_primax_97', name: 'PETRONAS Primax 97'},
          {id: 'fuel_dynamic_diesel', name: 'PETRONAS Dynamic Diesel'},
          {id: 'fuel_euro_5_diesel', name: 'PETRONAS Dynamic Diesel Euro 5'},
        ],
        createdAt: '2019-05-22T20:26:16.233Z',
        updatedAt: '2019-05-22T20:26:16.233Z',
      },
      {
        typeId: 'facilities',
        name: 'Facilities',
        features: [
          {id: 'facilities_setel_enabled', name: 'Setel enabled'},
          {id: 'facilities_atm', name: 'ATM'},
          {id: 'facilities_toilets', name: 'Toilets'},
          {id: 'facilities_surau', name: 'Surau'},
          {id: 'facilities_baby_change', name: 'Baby Change'},
          {id: 'facilities_epayment', name: 'e-Payment'},
          {id: 'facilities_grab_mesra_pitstop', name: 'Grab Mesra Pitstop'},
          {id: 'facilities_grab_rewards', name: 'Grab Rewards'},
          {id: 'facilities_bus_tickets', name: 'Bus Tickets'},
          {id: 'facilities_car_spa', name: 'Car Spa'},
        ],
        createdAt: '2019-05-22T20:26:16.234Z',
        updatedAt: '2019-05-22T20:26:16.234Z',
      },
      {
        typeId: 'fnb',
        name: 'Food and Beverage',
        features: [
          {id: 'fnb_dunkin_donuts', name: 'Dunkin Donuts'},
          {id: 'fnb_kfc', name: 'KFC'},
          {id: 'fnb_mcdonalds', name: "McDonald's"},
          {id: 'fnb_anw', name: 'A&W'},
          {id: 'fnb_subway', name: 'Subway'},
          {id: 'fnb_burger_king', name: 'Burger King'},
          {id: 'fnb_hot_n_roll', name: 'Hot & Roll'},
          {id: 'fnb_starbucks', name: 'Starbucks'},
          {id: 'fnb_morning_mesra', name: 'Morning @ Mesra'},
          {id: 'fnb_tealive', name: 'Tealive'},
        ],
        createdAt: '2019-05-22T20:26:16.236Z',
        updatedAt: '2019-05-22T20:26:16.236Z',
      },
      {
        typeId: 'setel_services',
        name: 'Setel Services',
        features: [
          {id: 'setel_services_fuel_purchase', name: 'Fuel Purchase'},
          {id: 'setel_services_mesra_store_purchase', name: 'Mesra Store Purchase'},
          {id: 'setel_services_concierge', name: 'Deliver2Me'},
        ],
        createdAt: '2020-01-23T09:19:19.834Z',
        updatedAt: '2020-01-23T09:19:19.834Z',
      },
    ]),
  ),
];
