import * as React from 'react';
import {screen} from '@testing-library/react';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig, suppressConsoleLogs} from '../../../lib/test-helper';
import {StoreDetails} from './store-details';
import {IStoreError} from '../stores.types';

const SAMPLE_ERROR: IStoreError = {
  message: 'Store not found',
  statusCode: 404,
  errorCode: '3701004',
};

describe(`<StoreDetails />`, () => {
  it('renders details', async () => {
    renderWithConfig(<StoreDetails tab={'details'} storeId={'abc123'} />);

    expect(await screen.findByText(/store-abc123/)).toBeDefined();
    expect(await screen.findByText(/merchant-abc123/)).toBeDefined();
    expect(await screen.findByText(/Other/)).toBeDefined();
    expect(await screen.findByText(/Mesra 1/)).toBeDefined();
    expect(await screen.findByText(/station-abc123/)).toBeDefined();
    expect(await screen.findByText(/PETRONAS abc123/)).toBeDefined();
    expect(await screen.findByText(/active/)).toBeDefined();
    expect(await screen.findByText(/Deliver to Vehicle/)).toBeDefined();
  });

  it(
    'renders error message',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(`${environment.storeApiBaseUrl}/api/stores/admin/stores/:id`, (_, res, ctx) => {
          return res(ctx.status(404), ctx.json(SAMPLE_ERROR));
        }),
      );
      renderWithConfig(<StoreDetails tab={'details'} storeId={'abc123'} />);

      expect(await screen.findByText(/Store not found/i)).toBeDefined();
    }),
  );
});
