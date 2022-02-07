import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import * as React from 'react';
import {environment} from 'src/environments/environment';
import {VARIABLES} from 'src/react/services/mocks/api-variables.service.mock';
import {server} from 'src/react/services/mocks/mock-server';
import {variablesRoles} from '../../../../shared/helpers/roles.type';
import {renderWithConfig} from '../../../lib/test-helper';
import {VariablesList} from './variables-list';

const MOCK_VARIABLES_LIST = [
  {
    version: 1,
    isArchived: false,
    key: 'app_voucher_top_up',
    name: 'app_voucher_top_up',
    description: 'Voucher top-up',
    group: 'app',
    type: 'boolean',
    tags: [{key: 'personalisation', value: 'personalisation'}],
    isToggled: true,
    createdBy: 'system',
    updatedBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
    createdAt: 1572355719,
    updatedAt: 1603260224,
  },
  {
    version: 2,
    isArchived: false,
    key: 'app_payment_screen_text',
    name: 'app_payment_screen_text',
    description: 'app_payment_screen_text',
    group: 'app',
    type: 'boolean',
    tags: [
      {key: 'personalisation', value: 'personalisation'},
      {key: 'fuel', value: 'fuel'},
    ],
    isToggled: true,
    createdBy: 'system',
    updatedBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
    createdAt: 1572355719,
    updatedAt: 1603260224,
  },
];

describe(`<VariablesList />`, () => {
  it('renders with list', async () => {
    renderWithConfig(<VariablesList />, {permissions: [variablesRoles.view]});

    const variableKey1 = await screen.findAllByText(VARIABLES[0].key);
    expect(variableKey1).toBeDefined();

    const variableKey2 = await screen.findAllByText(VARIABLES[1].key);
    expect(variableKey2).toBeDefined();
  });

  it('renders empty state', async () => {
    server.use(
      rest.get(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (_, res, ctx) => {
          return res.once(
            ctx.status(201),
            ctx.json({
              data: [],
              metadata: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                totalCount: 0,
              },
            }),
          );
        },
      ),
    );

    renderWithConfig(<VariablesList />, {permissions: [variablesRoles.view]});

    const noResultMessage = await screen.findByText(/No results/);
    expect(noResultMessage).toBeDefined();
  });

  it('renders with filters', async () => {
    server.use(
      rest.get(
        `${environment.variablesBaseUrl}/api/variables/admin/variables/:id`,
        (req, res, ctx) => {
          const tagsFilter = req.url.searchParams.get('tags');

          return res(
            ctx.status(201),
            ctx.json({
              data: tagsFilter
                ? MOCK_VARIABLES_LIST.filter((item) =>
                    item.tags.some((tag) => tag.value === tagsFilter),
                  )
                : MOCK_VARIABLES_LIST,
              metadata: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                totalCount: 0,
              },
            }),
          );
        },
      ),
    );

    renderWithConfig(<VariablesList />, {permissions: [variablesRoles.view]});

    const variableKey1 = await screen.findAllByText(/app_voucher_top_up/);
    expect(variableKey1).toBeDefined();

    const variableKey2 = await screen.findAllByText(/app_payment_screen_text/);
    expect(variableKey2).toBeDefined();

    const ddTag = await screen.findByTestId('dd-tag');
    user.click(ddTag);
    user.click(screen.getByRole('option', {name: 'fuel'}));

    const btnSearch = await screen.findByTestId('btn-search');
    user.click(btnSearch);

    await waitForElementToBeRemoved(variableKey1);

    expect(variableKey2).toBeDefined();
  });
});
