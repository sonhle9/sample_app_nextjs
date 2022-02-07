import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createPaginationHandler,
  createMockData,
  createDetailHandler,
} from 'src/react/lib/mock-helper';

const exceptions = createMockData(
  [
    {
      _id: '5fd0a93988f885001175a751',
      _deleted: false,
      merchantId: '5fd0a1bd0d2a5c001072bf92',
      merchantName: 'Marry_Test10',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: 'batch_string',
      terminalId: 'abc',
      createdAt: 'Wed Dec 09 2020 17:38:49 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:38:49 GMT+0700 (Indochina Time)',
      transactionNum: 3,
      transactionAmount: 20,
    },
    {
      _id: '5fd0ab120a5f6800107f9af5',
      _deleted: false,
      merchantId: '5fd0a1bd0d2a5c001072bf92',
      merchantName: 'Marry_Test10_Terminal_String',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: 'batch_string',
      terminalId: 'terminal_string',
      createdAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      transactionNum: 3,
      transactionAmount: 20,
    },
    {
      _id: '5fd1d72fa871ca0010598596',
      _deleted: false,
      merchantId: '5f992894d8a7df001004c090',
      merchantName: 'Batch_123_Test_Merchant',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: 'batch_123',
      terminalId: 'string',
      createdAt: 'Thu Dec 10 2020 15:07:11 GMT+0700 (Indochina Time)',
      updatedAt: 'Thu Dec 10 2020 15:07:11 GMT+0700 (Indochina Time)',
    },
    {
      _id: '5fd346f62ac85c0010582f0b',
      _deleted: false,
      merchantId: '60236698fdc64c00179b20a0',
      merchantName: 'Exception merchant',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: 'batch_string',
      terminalId: 'string',
      createdAt: 'Fri Dec 11 2020 17:16:22 GMT+0700 (Indochina Time)',
      updatedAt: 'Fri Dec 11 2020 17:16:22 GMT+0700 (Indochina Time)',
    },
    {
      _id: '5fd71bf4e9e53300102ac77a',
      _deleted: false,
      merchantId: '5f992894d8a7df001004c090',
      merchantName: 'Card',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: 'batch_vvv',
      terminalId: 'string',
      createdAt: 'Mon Dec 14 2020 15:01:56 GMT+0700 (Indochina Time)',
      updatedAt: 'Mon Dec 14 2020 15:01:56 GMT+0700 (Indochina Time)',
    },
  ],
  200,
);

const exceptionTransactions = createMockData(
  [
    {
      _id: '5fd0ab120a5f6800107f9af7',
      _deleted: false,
      platformTransactionId: '5fd0a8ed0a5f6800107f9af1',
      terminalTransactionId: null,
      transactionType: 'REFUND',
      transactionSubType: 'REFUND_GIFT_CARD',
      transactionDate: 'Mon Nov 30 2020 11:39:38 GMT+0700 (Indochina Time)',
      posBatchSettlementId: 'string',
      referenceId: null,
      platformAmount: 1,
      terminalAmount: 0,
      failType: 'ONLY_EXIST_ON_PLATFORM',
      posBatchUploadReportId: '5fd0ab120a5f6800107f9af5',
      createdAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      __v: 0,
    },
    {
      _id: '5fd0ab120a5f6800107f9a121',
      _deleted: false,
      platformTransactionId: null,
      terminalTransactionId: '5fd0a8ed0a5f6800107f9af1',
      transactionType: 'REFUND',
      transactionSubType: 'REFUND_GIFT_CARD',
      transactionDate: 'Mon Nov 30 2020 11:39:38 GMT+0700 (Indochina Time)',
      posBatchSettlementId: 'string',
      referenceId: null,
      platformAmount: 0,
      terminalAmount: 1,
      failType: 'ONLY_EXIST_ON_TERMINAL',
      posBatchUploadReportId: '5fd0ab120a5f6800107f9af5',
      createdAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      __v: 0,
    },
    {
      _id: '5fd0ab120a5f6800107f9af8',
      _deleted: false,
      platformTransactionId: '5fd0a90588f885001175a74d',
      terminalTransactionId: '5fd0aaeb88f885001175a753',
      transactionType: 'CHARGE',
      transactionSubType: 'CHARGE_GIFT_CARD',
      terminalTransactionUid: 'test1',
      transactionDate: 'Mon Nov 30 2020 11:39:38 GMT+0700 (Indochina Time)',
      posBatchSettlementId: 'string',
      referenceId: null,
      platformAmount: 3,
      terminalAmount: 10,
      failType: 'AMOUNT_MISMATCH',
      posBatchUploadReportId: '5fd0ab120a5f6800107f9af5',
      createdAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      __v: 0,
    },
    {
      _id: '5fd0ab120a5f6800107f9af9',
      _deleted: false,
      platformTransactionId: '5fd0a8ed0a5f6800107f9af1',
      terminalTransactionId: null,
      transactionType: 'REFUND',
      transactionSubType: 'REFUND_GIFT_CARD',
      transactionDate: 'Mon Nov 30 2020 11:39:38 GMT+0700 (Indochina Time)',
      posBatchSettlementId: 'string',
      referenceId: null,
      platformAmount: 1,
      terminalAmount: 0,
      failType: 'ONLY_EXIST_ON_TERMINAL',
      posBatchUploadReportId: '5fd0ab120a5f6800107f9af7',
      createdAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      updatedAt: 'Wed Dec 09 2020 17:46:42 GMT+0700 (Indochina Time)',
      __v: 0,
    },
  ],
  40,
);

const reconciliations = createMockData(
  [
    {
      _id: '5fcdfb693de9710010b9405d',
      _deleted: false,
      merchantId: '999999999900002',
      merchantName: 'test-gateway-999999999900002',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: '000172',
      terminalId: '00000002',
      type: 'BATCH_UPLOAD',
      isAmountMatch: false,
      systemAmounts: {
        totalNetPurchaseAmount: 120,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 40,
        totalNetTopupCount: 2,
      },
      terminalAmounts: {
        totalNetPurchaseAmount: 130,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 20,
        totalNetTopupCount: 2,
      },
      createdAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      updatedAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      posBatchUploadReportId: '5fd0ab120a5f6800107f9af5',
      __v: 0,
    },
    {
      _id: '5fcdfb693de9710010b9405e',
      _deleted: false,
      merchantId: '999999999900002',
      merchantName: 'test-gateway-999999999900002',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: '000172',
      terminalId: '00000002',
      type: 'INITIAL',
      isAmountMatch: false,
      systemAmounts: {
        totalNetPurchaseAmount: 120,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 40,
        totalNetTopupCount: 2,
      },
      terminalAmounts: {
        totalNetPurchaseAmount: 130,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 20,
        totalNetTopupCount: 2,
      },
      createdAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      updatedAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      __v: 0,
    },
    {
      _id: '5fcdfb693de9710010b9405g',
      _deleted: false,
      merchantId: '999999999900002',
      merchantName: 'test-gateway-999999999900002',
      settlementType: 'GIFT_CARD',
      posBatchSettlementId: '000172',
      terminalId: '00000002',
      type: 'BATCH_UPLOAD',
      isAmountMatch: false,
      systemAmounts: {
        totalNetPurchaseAmount: 120,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 40,
        totalNetTopupCount: 2,
      },
      terminalAmounts: {
        totalNetPurchaseAmount: 130,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 20,
        totalNetTopupCount: 2,
      },
      createdAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      updatedAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      __v: 0,
    },
    {
      _id: '5fcdfb693de9710010b9405h',
      _deleted: false,
      merchantId: '999999999900002',
      merchantName: 'test-gateway-999999999900002',
      settlementType: 'LOYALTY_CARD',
      posBatchSettlementId: '000172',
      terminalId: '00000002',
      type: 'BATCH_UPLOAD',
      isAmountMatch: false,
      systemAmounts: {
        totalNetPurchaseAmount: 120,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 40,
        totalNetTopupCount: 2,
      },
      terminalAmounts: {
        totalNetPurchaseAmount: 130,
        totalNetPurchaseCount: 3,
        totalNetTopupAmount: 20,
        totalNetTopupCount: 2,
      },
      createdAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      updatedAt: 'Mon Dec 07 2020 16:52:41 GMT+0700 (Indochina Time)',
      __v: 0,
    },
  ],
  6,
);

const BASE_URL = `${environment.settlementsApiBaseUrl}/api/settlements`;

export const handlers = [
  rest.get(
    `${BASE_URL}/admin/pos-batch-upload-reports`,
    createPaginationHandler((req) => {
      const merchantId = req.url.searchParams.get('merchantId');
      const batchId = req.url.searchParams.get('posBatchSettlementId');
      const terminalId = req.url.searchParams.get('terminalId');
      if (merchantId) {
        return exceptions.filter((ex) => ex.merchantId === merchantId);
      }
      if (batchId) {
        return exceptions.filter((ex) => ex.posBatchSettlementId === batchId);
      }
      if (terminalId) {
        return exceptions.filter((ex) => ex.terminalId === terminalId);
      }
      return exceptions;
    }),
  ),
  rest.get(
    `${BASE_URL}/admin/admin/pos-batch-upload-reports/:reportId`,
    createDetailHandler(exceptions, '_id'),
  ),
  rest.get(
    `${BASE_URL}/admin/pos-batch-upload-reports/:id/transactions`,
    createPaginationHandler((req) => {
      const id = req.url.searchParams.get('id');
      return exceptionTransactions.filter((ex) => ex.posBatchUploadReportId === id);
    }),
  ),
  rest.get(
    `${BASE_URL}/admin/pos-settlement-reports/:reportId`,
    createDetailHandler(reconciliations, 'reportId'),
  ),
];
