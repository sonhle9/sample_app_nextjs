import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {
  createDetailHandler,
  createFixResponseHandler,
  createMockData,
  createPaginationHandler,
} from 'src/react/lib/mock-helper';
import {ConstraintOperator, VariableState, VariableType} from 'src/react/modules/variables/const';
import {ITargetingOptions, IVariable} from 'src/react/modules/variables/types';

function generateMockVariable(params?: Partial<IVariable>): IVariable {
  return {
    key: 'test',
    version: 1,
    isArchived: false,
    name: 'test',
    type: VariableType.String,
    createdAt: 1572355719,
    updatedAt: 1603260224,
    group: 'app',
    isToggled: false,
    createdBy: 'test',
    updatedBy: 'test',
    state: VariableState.Created,
    ...(params || {}),
  };
}

export function generateMockTargetingOptions(): ITargetingOptions {
  return {
    operators: [
      {key: 'semVerIn', value: 'SemVer is one of', valueType: 'object'},
      {key: 'semVerNotIn', value: 'SemVer is not one of', valueType: 'object'},
      {key: 'semVerGreaterThan', value: 'SemVer >', valueType: 'string'},
      {key: 'semVerGreaterThanEqual', value: 'SemVer >=', valueType: 'string'},
      {key: 'semVerLessThan', value: 'SemVer <', valueType: 'string'},
      {key: 'semVerLessThanEqual', value: 'SemVer <=', valueType: 'string'},
      {key: 'isOneOf', value: 'is one of', valueType: 'object'},
      {key: 'isNotOneOf', value: 'is not one of', valueType: 'object'},
      {key: 'contains', value: 'contains', valueType: 'string'},
      {key: 'doesNotContains', value: 'does not contains', valueType: 'string'},
      {key: 'equal', value: 'equal', valueType: 'string'},
      {key: 'in', value: 'in', valueType: 'object'},
    ],
    properties: [
      {key: 'appVersion', value: 'appVersion'},
      {key: 'userId', value: 'userId'},
      {key: 'deviceId', value: 'deviceId'},
      {key: 'osName', value: 'osName'},
      {key: 'osVersion', value: 'osVersion'},
      {key: 'phoneModel', value: 'phoneModel'},
      {key: 'interfaceId', value: 'interfaceId'},
      {key: 'interfaceType', value: 'interfaceType'},
    ],
  };
}

const INITIAL_VARIABLE: IVariable = {
  version: 1,
  isArchived: false,
  key: 'app_voucher_top_up',
  name: 'app_voucher_top_up',
  description: 'Voucher top-up',
  group: 'app',
  type: VariableType.Boolean,
  isToggled: true,
  createdBy: 'system',
  updatedBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
  createdAt: 1572355719,
  updatedAt: 1603260224,
  state: VariableState.Created,
};

export const VARIABLES = createMockData<IVariable>(
  [
    INITIAL_VARIABLE,
    {
      ...INITIAL_VARIABLE,
      key: 'app_testing_key',
      targets: [
        {
          priority: 0,
          constraints: [
            {property: 'userId', operator: ConstraintOperator.In, value: {user1: true}},
            {property: 'userId', operator: ConstraintOperator.Equal, value: 'user2'},
          ],
          distributions: [{variantKey: 'foo', percent: 100}],
        },
      ],
      variants: {
        foo: {key: 'foo', value: true},
        bar: {key: 'bar', value: false},
      },
      onVariation: [{variantKey: 'foo', percent: 100}],
      offVariation: 'bar',
    },
    {
      ...INITIAL_VARIABLE,
      key: 'app_reload_wallet',
      name: 'app_reload_wallet',
      description: 'Voucher top-up',
      group: 'app',
      type: VariableType.Boolean,
      tags: [{key: 'personalisation', value: 'personalisation'}],
      isToggled: true,
      createdBy: 'system',
      updatedBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
      createdAt: 1572355719,
      updatedAt: 1603260224,
      state: VariableState.Created,
    },
    {
      ...INITIAL_VARIABLE,
      key: 'app_payment_screen_text',
      name: 'app_payment_screen_text',
      description: 'app_payment_screen_text',
      group: 'app',
      type: VariableType.Boolean,
      tags: [
        {key: 'personalisation', value: 'personalisation'},
        {key: 'fuel', value: 'fuel'},
      ],
      isToggled: true,
      createdBy: 'system',
      updatedBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
      createdAt: 1572355719,
      updatedAt: 1603260224,
      state: VariableState.Created,
    },
  ],
  10,
  (data, i) => ({
    ...data,
    key: `${data.key}-${i}`,
  }),
);

const baseUrl = `${environment.variablesBaseUrl}/api/variables`;

export const handlers = [
  rest.get(
    `${baseUrl}/admin/variables/targeting-options`,
    createFixResponseHandler(generateMockTargetingOptions()),
  ),
  rest.get(
    `${baseUrl}/admin/variables/all`,
    createPaginationHandler(VARIABLES, {
      bodyMapper: (info) => ({
        data: info.data,
        metadata: {
          currentPage: info.page,
          pageCount: info.totalPage,
          totalCount: info.total,
          pageSize: info.perPage,
        },
      }),
    }),
  ),
  rest.get(
    `${baseUrl}/admin/variables/:id`,
    createDetailHandler(VARIABLES, 'id', {
      comparator: (param, key) => param === encodeURIComponent(key),
    }),
  ),
  rest.get(
    `${baseUrl}/admin/variables/:id/history`,
    createFixResponseHandler({
      data: [
        {
          key: 'test',
          variable: generateMockVariable(),
          updatedBy: 'test',
          createdAt: 0,
          comment: 'test',
        },
      ],
      metadata: {
        currentPage: 1,
        pageCount: 10,
        pageSize: 10,
        totalCount: 100,
      },
    }),
  ),
  rest.get(
    `${baseUrl}/admin/app-settings`,
    createFixResponseHandler({
      screen: ['600px', '890px', '1200px'],
    }),
  ),
  rest.put(
    `${baseUrl}/admin/app-settings`,
    createFixResponseHandler({
      screen: ['600px', '890px', '1200px'],
    }),
  ),
];
