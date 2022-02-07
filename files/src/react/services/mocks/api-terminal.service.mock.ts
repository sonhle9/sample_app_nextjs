import {environment} from 'src/environments/environment';
import {rest} from 'msw';
import {createMockData, createPaginationHandler} from 'src/react/lib/mock-helper';
import {getId} from '@setel/web-utils';
import {ITerminalInventory} from '../api-terminal.type';
import {TerminalStatus} from 'src/react/modules/setel-terminals/setel-terminals.const';

export const terminals = createMockData(
  [
    {
      id: '1293812093810928312',
      terminalId: '00000001',
      status: 'ACTIVATED',
      type: 'EDC',
      serialNum: 'serial-12345',
      deploymentDate: new Date('2020-10-01'),
      modelReference: '1234',
      merchantId: '60236698fdc64c00179b20a0',
      merchantName: 'Merchant_Search_By_ID',
      createdAt: new Date('2020-09-30').toISOString(),
      updatedAt: new Date('2020-09-30').toISOString(),
      remarks: 'For testing only',
    },
    {
      myDebitOptIn: false,
      allowedEntryModes: ['swipe', 'chip', 'contactless'],
      isSettlement: false,
      status: 'SUSPENDED',
      serialNum: 'PB1239871234',
      merchantPass: {isEnabled: true, value: '273432'},
      adminPass: '216757',
      type: 'EDC',
      terminalId: '10000109',
      terminalMenu: {
        isTmsFunctionsEnabled: true,
        isSettingsEnabled: true,
        isSettlementEnabled: true,
        isCheckBalanceEnabled: true,
        isTopUpEnabled: true,
        isTransactionEnabled: true,
        isSmartpaySaleEnabled: true,
        isChargeEnabled: true,
      },
      timeline: [
        {status: 'ACTIVATED', date: '2021-10-16T05:45:12.290Z'},
        {status: 'CREATED', date: '2021-10-15T04:46:22.517Z'},
        {status: 'NEW', date: '2021-10-15T03:52:04.428Z'},
      ],
      modelReference: 'P2',
      manufacturer: 'Sunmi',
      hostTerminalRegistration: [],
      createdAt: '2021-10-15T04:13:57.799Z',
      updatedAt: '2021-10-18T02:56:08.526Z',
      merchantId: '60236698fdc64c00179b20a0',
      merchantName: 'Merchant_Search_By_Name',
      remarks: 'holamano',
      id: '61690005e594abd110d26272',
    },
    {
      id: '129380209381092832',
      terminalId: '00000003',
      status: 'CREATED',
      type: 'EDC',
      deploymentDate: new Date('2020-10-01'),
      merchantId: '60236698fdc64c00179b20a0',
      merchantName: 'Merchant Name',
      remarks: 'For testing only',
      myDebitOptIn: false,
      allowedEntryModes: ['swipe', 'chip', 'contactless'],
      isSettlement: false,
      serialNum: 'PB1239871236',
      merchantPass: {isEnabled: true, value: '273432'},
      adminPass: '216757',
      terminalMenu: {
        isTmsFunctionsEnabled: true,
        isSettingsEnabled: true,
        isSettlementEnabled: true,
        isCheckBalanceEnabled: true,
        isTopUpEnabled: true,
        isTransactionEnabled: true,
        isSmartpaySaleEnabled: true,
        isChargeEnabled: true,
      },
      timeline: [
        {status: 'ACTIVATED', date: '2021-10-16T05:45:12.290Z'},
        {status: 'CREATED', date: '2021-10-15T04:46:22.517Z'},
        {status: 'NEW', date: '2021-10-15T03:52:04.428Z'},
      ],
      modelReference: 'P2',
      manufacturer: 'Sunmi',
      hostTerminalRegistration: [],
      metrics: {
        androidVersion: 'Android 10.0',
        appVersion: 'APP_VERSION',
        battery: 15,
        cpu: 78,
        createdAt: '2021-11-09T14:22:56.089+08:00',
        environment: 'DEVELOPMENT',
        firmwareVersion: '1.232.1',
        freeStorage: 10,
        imei: 'IMEI90000',
        location: {
          coordinates: [130.98729, 60.1922123],
          type: 'Point',
        },
        pciPtsPoiProductType: 'PCI_PTS_PRODUCT_TYPE',
        pciPtsVersion: 'PCI_PTS_VERSION',
        ram: 30,
        screenHeight: 800,
        screenWidth: 1200,
        simCardDetails: {},
        totalStorage: 212,
        updatedAt: '2021-11-09T14:22:56.089+08:00',
        wifiDetails: {
          ip: '192.168.1.1',
          name: 'TEST_WIFI',
        },
      },
      createdAt: '2021-10-15T04:13:57.799Z',
      updatedAt: '2021-10-18T02:56:08.526Z',
    },
  ],
  200,
);

export const terminalInventory: ITerminalInventory[] = createMockData(
  [
    {
      id: '1',
      serialNum: 'serialNum1',
      terminalId: '10000109',
      status: TerminalStatus.DEACTIVATED,
      createdAt: '2021-10-15T04:13:57.799Z',
    },
    {
      id: '2',
      serialNum: 'randomSerialNumber2',
      terminalId: '10000110',
      status: TerminalStatus.NEW,
      createdAt: '2021-10-15T04:13:57.799Z',
    },
    {
      id: '3',
      serialNum: 'randomSerialNumber3',
      terminalId: '10000120',
      status: TerminalStatus.CREATED,
      createdAt: '2021-10-15T04:13:57.799Z',
    },
  ],
  200,
);

const BASE_URL = `${environment.setelTerminalApiBaseUrl}/api/terminal`;

export const handlers = [
  rest.get(
    `${BASE_URL}/terminals`,
    createPaginationHandler((req) => {
      const merchantId = req.url.searchParams.get('merchantId');
      const status = req.url.searchParams.get('status');
      const type = req.url.searchParams.get('type');
      if (merchantId) {
        return terminals.filter((t) => t.merchantId === merchantId);
      }
      if (status) {
        return terminals.filter((t) => t.status === status);
      }
      if (type) {
        return terminals.filter((t) => t.type === type);
      }
      return terminals;
    }),
  ),
  rest.get(
    `${BASE_URL}/admin/inventory`,
    createPaginationHandler((req) => {
      const serialNum = req.url.searchParams.get('serialNum');

      if (serialNum) {
        return terminalInventory.filter((t) => t.serialNum === serialNum);
      }

      return terminalInventory;
    }),
  ),
  rest.post(`${BASE_URL}/terminals`, (req, res, ctx) => {
    const body = req.body as Record<string, string>;
    const data = {
      serialNum: 'newCreatedSerialNum',
      id: getId(),
      merchantId: body.merchantId,
      merchantName: 'Merchant_For_New_Terminal',
    };
    terminals.push(data as any);
    return res(ctx.json(data));
  }),
  rest.get(`${BASE_URL}/terminals/:serialNum`, (req, res, ctx) => {
    const serialNum = req.params['serialNum'];
    const terminal = terminals.find((t) => t.serialNum === serialNum);
    return res(ctx.json(terminal));
  }),
  rest.put(`${BASE_URL}/terminals/:serialNum`, (req, res, ctx) => {
    const serialNum = req.params['serialNum'];
    const index = terminals.findIndex((t) => t.serialNum === serialNum);
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Terminal not found',
        }),
      );
    }
    terminals[index] = {
      ...terminals[index],
      ...(req.body as Record<string, string>),
    };
    return res(ctx.json(terminals[index]));
  }),
  rest.post(`${BASE_URL}/admin/inventory/manual`, (req, res, ctx) => {
    const body = req.body as Record<string, string>;
    const data = {
      serialNum: body.serialNum,
    };
    return res(ctx.json(data));
  }),
  rest.put(`${BASE_URL}/terminals/deactivate/:serialNum`, (req, res, ctx) => {
    const body = req.body as Record<string, string>;
    return res(ctx.json(body));
  }),
];
