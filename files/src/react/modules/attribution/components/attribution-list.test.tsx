import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import * as React from 'react';
import {environment} from 'src/environments/environment';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {ATTRIBUTE_RULES} from 'src/react/services/mocks/api-attributes.service.mock';
import {server} from 'src/react/services/mocks/mock-server';
import {attributionRoles} from '../../../../shared/helpers/roles.type';
import {AttributionList} from './attribution-list';

describe(`<AttributionList />`, () => {
  it('renders with list', async () => {
    renderWithConfig(<AttributionList />, {permissions: [attributionRoles.view]});

    const referenceId1 = await screen.findByText(ATTRIBUTE_RULES[0].referenceId);
    expect(referenceId1).toBeDefined();
  });

  it('renders empty state', async () => {
    server.use(
      rest.get(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules`, (_, res, ctx) => {
        return res.once(ctx.status(201), ctx.json([]));
      }),
    );

    renderWithConfig(<AttributionList />, {permissions: [attributionRoles.view]});

    const noResultMessage = await screen.findByText(/No results/);
    expect(noResultMessage).toBeDefined();
  });

  it('renders with filters', async () => {
    renderWithConfig(<AttributionList />, {permissions: [attributionRoles.view]});

    const referenceId1 = await screen.findByText('refIdAbc123');
    expect(referenceId1).toBeDefined();

    const referenceId2 = await screen.findByText('refIdAbc456');
    expect(referenceId2).toBeDefined();

    const ddReferenceSource = await screen.findByTestId('dd-source');
    user.click(ddReferenceSource);
    user.click(screen.getByRole('option', {name: 'Voucher batch'}));

    const btnSearch = await screen.findByTestId('btn-search');
    user.click(btnSearch);

    await waitForElementToBeRemoved(referenceId1);
    expect(referenceId2).toBeDefined();
  });
});
