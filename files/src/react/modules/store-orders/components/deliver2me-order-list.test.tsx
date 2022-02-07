import * as React from 'react';
import {screen, waitFor, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {Deliver2MeOrderList} from './deliver2me-order-list';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {formatDate} from '@setel/portal-ui';
import {retailRoles} from 'src/shared/helpers/roles.type';

describe(`<Deliver2MeOrderList />`, () => {
  it('should fetch on load', async () => {
    renderWithConfig(<Deliver2MeOrderList />);

    const withinStoreOrderList = within(screen.getByTestId('deliver2me-list-table'));

    // Store, station, user
    expect(await withinStoreOrderList.findByText(/Store 1/i)).toBeDefined();
    expect(await withinStoreOrderList.findByText(/Station 2/i)).toBeDefined();
    expect(await withinStoreOrderList.findByText(/User 3/i)).toBeDefined();

    // Mapped status
    expect(await withinStoreOrderList.findByText(/Acknowledged/i)).toBeDefined();
    expect(await withinStoreOrderList.findByText(/Points Issuance Success/i)).toBeDefined();
    expect(await withinStoreOrderList.findByText(/Charge Error/i)).toBeDefined();

    // Date
    expect(
      await screen.findByText(new RegExp(formatDate(new Date('2020-12-14T20:34:44.929Z')), 'i')),
    ).toBeDefined();
    expect(
      await screen.findByText(new RegExp(formatDate(new Date('2020-12-15T03:16:44.257Z')), 'i')),
    ).toBeDefined();
    expect(
      await screen.findByText(new RegExp(formatDate(new Date('2020-12-15T10:03:26.766Z')), 'i')),
    ).toBeDefined();

    // Amount
    expect(await screen.findByText(/4.60/i)).toBeDefined();
    expect(await screen.findByText(/1.92/i)).toBeDefined();
    expect(await screen.findByText(/16.00/i)).toBeDefined();
  });

  it('should fetch on filter change', (done) => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/store-orders/admin/in-car`, (req, res, ctx) => {
        const param = req.url.searchParams.get('query');
        if (param) {
          expect(param).toEqual('Station 1');
          done();
        }
        return res(ctx.json([]));
      }),
    );

    renderWithConfig(<Deliver2MeOrderList />);

    (async function run() {
      const txtStoreName = await screen.findAllByTestId('filter-query');
      user.type(txtStoreName[0], 'Station 1{enter}');
    })();
  });

  it('show empty message', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/store-orders/admin/in-car`, (_req, res, ctx) => {
        return res(ctx.json([]));
      }),
    );

    renderWithConfig(<Deliver2MeOrderList />);

    expect(await screen.findByText(/No data available./i)).toBeDefined();
  });

  it('downloads csv when there is data in list', async () => {
    let downloadReq;
    server.use(
      rest.get(
        `${environment.storeApiBaseUrl}/api/store-orders/admin/in-car/csv`,
        (req, res, ctx) => {
          downloadReq = req;
          return res(ctx.body('csv'));
        },
      ),
    );
    renderWithConfig(<Deliver2MeOrderList />, {permissions: [retailRoles.storeInCarOrderExport]});

    const withinStoreOrderList = within(screen.getByTestId('deliver2me-list-table'));
    await withinStoreOrderList.findByText(/Store 1/);

    user.click(await screen.findByTestId('action-download'));
    await waitFor(() => expect(downloadReq).toBeDefined());
  });

  it(
    'show error when API call fails',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(
          `${environment.storeApiBaseUrl}/api/store-orders/admin/in-car`,
          (_req, res, ctx) => {
            return res(ctx.status(400), ctx.json({message: 'Bad request'}));
          },
        ),
      );

      renderWithConfig(<Deliver2MeOrderList />);

      expect(await screen.findByText(/Bad request/i)).toBeDefined();
    }),
  );
});
