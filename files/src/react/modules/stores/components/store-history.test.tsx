import * as React from 'react';
import {screen, waitFor, within} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {StoreHistory} from './store-history';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {formatDate} from '@setel/portal-ui';

describe(`<StoreHistory />`, () => {
  it('should render', async () => {
    renderWithConfig(<StoreHistory />);
    expect(await screen.findByText(/History/i)).toBeDefined();
  });

  it('should fetch on load', async () => {
    renderWithConfig(<StoreHistory />);

    const withinStoreHistoryList = within(screen.getByTestId('store-history-table'));

    // user
    expect(await withinStoreHistoryList.findByText(/Test User 1/i)).toBeDefined();
    expect(await withinStoreHistoryList.findByText(/Test User 2/i)).toBeDefined();

    // Date
    expect(
      await screen.findByText(new RegExp(formatDate(new Date('2021-12-13T02:23:57.540Z')), 'i')),
    ).toBeDefined();
    expect(
      await screen.findByText(new RegExp(formatDate(new Date('2021-12-13T02:21:03.076Z')), 'i')),
    ).toBeDefined();
  });

  it('should fetch on filter change', (done) => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs`, (req, res, ctx) => {
        const param = req.url.searchParams.get('query');
        if (param) {
          expect(param).toEqual('Store Name');
          done();
        }
        return res(ctx.json([]));
      }),
    );

    renderWithConfig(<StoreHistory />);

    (async function run() {
      const txtFieldName = await screen.findAllByTestId('filter-query');
      user.type(txtFieldName[0], 'Store Name{enter}');
    })();
  });

  it('show empty message', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs`, (_req, res, ctx) => {
        return res(ctx.json([]));
      }),
    );

    renderWithConfig(<StoreHistory />);

    expect(await screen.findByText(/No data available./i)).toBeDefined();
  });

  it(
    'show error when API call fails',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs`, (_req, res, ctx) => {
          return res(ctx.status(400), ctx.json({message: 'Bad request'}));
        }),
      );

      renderWithConfig(<StoreHistory />);

      expect(await screen.findByText(/Bad request/i)).toBeDefined();
    }),
  );

  it('downloads csv when there is data in list', async () => {
    let downloadReq;
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/activity-logs/csv`, (req, res, ctx) => {
        downloadReq = req;
        return res(ctx.body('csv'));
      }),
    );
    renderWithConfig(<StoreHistory />);

    const withinStoreOrderList = within(screen.getByTestId('store-history-table'));
    await withinStoreOrderList.findByText(/Test User 1/);

    user.click(await screen.findByTestId('store-history-download'));
    await waitFor(() => expect(downloadReq).toBeDefined());
  });
});
