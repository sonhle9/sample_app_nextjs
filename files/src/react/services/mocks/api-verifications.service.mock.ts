import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createFixResponseHandler,
  createDetailHandler,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';
import {
  IVerification,
  IJumioAssessment,
  JumioClassificationEnum,
  CallbackCompletionStatusEnum,
} from 'src/shared/interfaces/verifications.interface';

const verificationsBaseURL = `${environment.verificationsApiBaseUrl}/api/verifications`;

export const MOCK_VERIFICATIONS: IVerification[] = [
  {
    id: '67ueu28c3b860010322567',
    referenceId: '3982df53-5b15-4610-a1ac-65f088cae9f3',
    customerId: 'ea9e5319-ba23-442f-a2da-82f40ce70230',
    callbackStatus: CallbackCompletionStatusEnum.Completed,
    verificationStatus: 'APPROVED',
    classification: 'TRUE_NEGATIVE',
    rejectReason: 'Failed to match Identity',
    verificationDate: '2020-07-28T04:26:08.848Z',
    callbackDate: '2020-07-28T04:22:47.416Z',
    firstAttemptDate: '2020-07-28T04:23:47.091Z',
    attemptNum: 6,
    idType: 'ID_CARD',
    idNumber: '013436200',
    firstName: 'Siti',
    lastName: 'Farra',
    fullName: 'Siti Farra',
    mobileNum: '0132322332',
    gender: 'Woman',
    dateOfBirth: '1995-02-20T00:00:00.000Z',
    country: 'Malaysia',
    countryDisplayName: 'Malaysia',
    address: null,
    callbackObj: null,
    updateRemarks: 'try',
    lastUpdatedByUser: 'malcolm.kee+test@setel.my',
    images: {
      scan: 'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-scan?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193062&Signature=w4nIWy6HdTjzeJIjKMmzt2P6Nr4%3D',
      back: 'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-back?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193078&Signature=PAkn%2F4lEHF8uS%2FPh%2FDCgFDaE7Ao%3D',
      face: 'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-face?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193078&Signature=pttEPdDQyVS0vYx7rYXN4fo1Vn4%3D',
    },
    livenessImages: [
      'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-liveness-0?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193129&Signature=cGqEAgMQbNnZZaIvh44bvrvNTYw%3D',
      'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-liveness-1?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193129&Signature=%2FkboVn1ZvU4eRLeP3h842Vszbvk%3D',
      'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-liveness-2?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193129&Signature=oAGg5VinJll67tcSzBHnmLAtndw%3D',
      'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-liveness-3?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193129&Signature=k1XYCBNQaD6k30U1nFsY6RQnvEk%3D',
      'https://api-verifications-dev.s3.ap-southeast-1.amazonaws.com/jumio-scan-image/c552efda-b0be-4d79-bdde-ff2a572692b2-liveness-4?AWSAccessKeyId=AKIAUKIHD26367NLFH4J&Expires=1606193129&Signature=Ow2qxaF2YUfEnmpe8lgHOmzy8i4%3D',
    ],
    createdAt: '2020-07-28T04:23:27.345Z',
    updatedAt: '2020-11-24T03:43:26.736Z',
  },
  {
    id: '5f1fa83fcc3b860010322567',
    referenceId: '3982df53-5b15-4610-a1ac-65f088cae9d5',
    customerId: 'ea9e5319-ba23-442f-a2da-82f40ce70221',
    callbackStatus: CallbackCompletionStatusEnum.Completed,
    verificationStatus: 'APPROVED',
    classification: 'TRUE_POSITIVE',
    rejectReason: '',
    verificationDate: '2020-07-28T04:26:08.848Z',
    callbackDate: '2020-07-28T04:22:47.416Z',
    firstAttemptDate: '2020-07-28T04:23:47.091Z',
    attemptNum: 6,
    idNumber: '23000',
    firstName: 'Nur',
    lastName: 'Farhana',
    fullName: 'Nur Farhana',
    mobileNum: '0132322332',
    gender: 'Woman',
    dateOfBirth: '26/7/97',
    country: 'Singapore',
    countryDisplayName: 'Singapore',
    updateRemarks: 'try',
    lastUpdatedByUser: 'malcolm.kee+test@setel.my',
    images: {
      scan: '',
      back: '',
      face: '',
    },
    livenessImages: [],
    createdAt: '2020-07-28T04:23:27.345Z',
    updatedAt: '2020-11-24T03:43:26.736Z',
  },
  {
    id: '5f1fa83fcc3b860010322567',
    referenceId: '4982df53-5b15-4610-a1ac-65f088cae9d5',
    customerId: 'd812d91d-fd8b-48d9-b889-25150c93c38f',
    callbackStatus: CallbackCompletionStatusEnum.Completed,
    verificationStatus: 'APPROVED',
    classification: 'TRUE_POSITIVE',
    rejectReason: '',
    verificationDate: '2020-07-28T04:26:08.848Z',
    callbackDate: '2020-07-28T04:22:47.416Z',
    firstAttemptDate: '2020-07-28T04:23:47.091Z',
    attemptNum: 6,
    idNumber: '23000',
    firstName: 'Megatest',
    lastName: 'User',
    fullName: 'Mega Test User',
    mobileNum: '0132322332',
    gender: 'Woman',
    dateOfBirth: '26/7/97',
    country: 'Singapore',
    countryDisplayName: 'Singapore',
    updateRemarks: 'try',
    lastUpdatedByUser: 'malcolm.kee+test@setel.my',
    images: {
      scan: '',
      back: '',
      face: '',
    },
    livenessImages: [],
    createdAt: '2020-07-28T04:23:27.345Z',
    updatedAt: '2020-11-24T03:43:26.736Z',
  },
];

export const MOCK_JUMIO_ASSESSMENTS: IJumioAssessment[] = [
  {
    id: '67ueu28c3b860010322569',
    verificationId: '67ueu28c3b860010322567',
    result: JumioClassificationEnum.POSITIVE,
    documentAuthenticity: {classification: JumioClassificationEnum.POSITIVE},
    biometricMatching: {classification: JumioClassificationEnum.POSITIVE},
    others: {classification: JumioClassificationEnum.POSITIVE},
    remark: 'test',
    verifiedAt: new Date(),
    _embedded: {
      verifiedBy: {
        id: '67ueu28c3b860010322566',
        identifier: 'Test User',
      },
    },
  },
];

export const handlers = [
  rest.get(
    `${verificationsBaseURL}/verifications`,
    createPaginationHandler((req) => {
      const searchKey = req.url.searchParams.get('searchKey');

      if (searchKey) {
        return MOCK_VERIFICATIONS.filter((c) => c.idNumber === searchKey);
      }

      return MOCK_VERIFICATIONS;
    }),
  ),

  rest.get(
    `${verificationsBaseURL}/verifications/:id`,
    createDetailHandler(MOCK_VERIFICATIONS, 'id'),
  ),

  rest.get(
    `${verificationsBaseURL}/jumio-assessments/:id`,
    createDetailHandler(MOCK_JUMIO_ASSESSMENTS, 'verificationId'),
  ),

  rest.put(`${verificationsBaseURL}/verifications/:id`, (req, res, ctx) => {
    const currentConfig = MOCK_VERIFICATIONS.find((c) => c.id === req.params.id);

    if (!currentConfig) {
      return res(ctx.status(404));
    }

    Object.keys(req.body).forEach((key) => {
      currentConfig[key] = req.body[key];
    });

    return res(ctx.json(currentConfig));
  }),

  rest.get(
    `${verificationsBaseURL}/verifications/experian/:id`,
    createFixResponseHandler({
      isMatched: true,
      matchedProfiles: [
        {
          ProID: '1195138',
          Gdr: 'F',
          IcoTyps: ['PEP'],
          MatSco: '100',
          MatNam: 'Waqo, Naomi Jillo',
          Cty: 'Kenya',
          Tit: 'Nominated Member, Senate, JP',
        },
      ],
      verificationId: '06908737-4bd8-41c4-b416-49e14be036345',
      type: 'CCDI',
      systemIdentifiedMatchStatus: true,
      searchId: '11111',
      reportObj: {
        report_date: '2021-01-08',
        input_request: {
          search_name: '',
          product_code: 'CDDI',
          subscriber_refno: '06908737-4bd8-41c4-b416-49e14be036345',
        },
        request_criteria: {
          dateRequest: '08 JAN 2021',
          requestor_name: 'SETEL UAT',
          subscriber_refno: '06908737-4bd8-41c4-b416-49e14be036345',
          EntityNo: '11111',
          EntityNoType: 'National ID',
        },
        search_result: {
          profile_lists: [
            {
              ProID: '1195138',
              Gdr: 'F',
              IcoTyps: ['PEP'],
              MatSco: '100',
              MatNam: 'Waqo, Naomi Jillo',
              Cty: 'Kenya',
              Tit: 'Nominated Member, Senate, JP',
            },
          ],
        },
        end: {
          subscriber_name: 'Setel UAT',
          username: 'SETEL UAT',
          order_id: 35481738,
          order_date: '2021-01-08',
          order_time: '16:50:43',
          userid: 'SETELUAT1',
        },
      },
      status: 'SUCCEEDED',
      reportOrderId: '35481738',
      subscriber_refno: '06908737-4bd8-41c4-b416-49e14be036345',
      createdAt: '2021-01-08T08:50:56.666Z',
      updatedAt: '2021-01-08T08:50:56.666Z',
      id: '5ff81cf0f117bd0010d1f6cc',
    }),
  ),

  rest.post(`${verificationsBaseURL}/blacklists/upload`, (_, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.get(
    `${verificationsBaseURL}/verifications/customers/:customerId/latest`,
    createDetailHandler(MOCK_VERIFICATIONS, 'customerId'),
  ),
];
