import * as React from 'react';
import {screen, within} from '@testing-library/react';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig} from '../../../lib/test-helper';
import {StoreList} from './store-list';

describe(`<StoreList />`, () => {
  it('renders list', async () => {
    renderWithConfig(<StoreList />);

    const withinStoreList = within(screen.getByTestId('store-list'));

    expect(await withinStoreList.findByText(/Mesra 1/i)).toBeDefined();
    expect(await withinStoreList.findByText(/PETRONAS def456/i)).toBeDefined();
    expect(await withinStoreList.findByText(/COMING SOON/i)).toBeDefined();
  });

  it('renders empty state', async () => {
    server.use(
      rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores`, (_, res, ctx) => {
        return res(ctx.json([]));
      }),
    );
    renderWithConfig(<StoreList />);

    expect(await screen.findByText(/No result/i)).toBeDefined();
  });
});
