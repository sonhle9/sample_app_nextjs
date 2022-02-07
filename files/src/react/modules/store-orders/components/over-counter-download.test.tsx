import * as React from 'react';
import {screen, waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {environment} from 'src/environments/environment';
import {OverCounterDownload} from './over-counter-download';
import {retailRoles} from 'src/shared/helpers/roles.type';

describe(`<OverCounterDownload />`, () => {
  it('downloads csv', async () => {
    let downloadReq;
    server.use(
      rest.get(
        `${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders/csv`,
        (req, res, ctx) => {
          downloadReq = req;
          return res(ctx.body('csv'));
        },
      ),
    );
    renderWithConfig(<OverCounterDownload filter={{}} />, {
      permissions: [retailRoles.storeOrderExport],
    });
    user.click(await screen.findByTestId('over-counter-csv-download'));
    await waitFor(() => expect(downloadReq).toBeDefined());
  });
});
