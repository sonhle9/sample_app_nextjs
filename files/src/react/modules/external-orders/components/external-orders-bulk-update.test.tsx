import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import * as React from 'react';
import {environment} from 'src/environments/environment';
import {renderWithConfig} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {ExternalOrdersBulkUpdate} from './external-orders-bulk-update';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ExternalOrdersBulkUpdate />', () => {
  it('works for positive scenario', async () => {
    const helpers = render();

    helpers.openFileModal();
    helpers.uploadFile('external-order.csv');

    expect(await screen.findByText('RECEIPT NUMBER')).toBeVisible();

    helpers.confirmGrant();

    expect(screen.getByText('external-order.csv')).toBeVisible();

    expect(await screen.findByText('Successfully uploaded')).toBeVisible();

    expect(screen.queryByText('external-order.csv')).toBeNull();
  });

  it('can replace and remove uploaded file', async () => {
    const helpers = render();

    helpers.openFileModal();
    helpers.uploadFile('external-order.csv');

    expect(await screen.findByText('RECEIPT NUMBER')).toBeVisible();

    user.click(screen.getByLabelText('Replace file'));
    helpers.uploadFile('external-order-v2.csv');
    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(screen.getByText('external-order-v2.csv')).toBeVisible();
    expect(screen.queryByText('external-order.csv')).toBeNull();

    user.click(screen.getByLabelText('Remove file'));
    user.click(screen.getByText('DELETE'));
    expect(screen.queryByText('external-order-v2.csv')).toBeNull();
  });

  it('can retry if grant error', async () => {
    server.use(
      rest.post(
        `${environment.externalOrdersApiBaseUrl}/api/external-orders/admin/loyalty/bulk-grant`,
        (_, res, ctx) => {
          return res.once(
            ctx.status(432),
            ctx.json({
              message: 'Server busy',
            }),
          );
        },
      ),
    );

    const helpers = render();

    helpers.openFileModal();
    helpers.uploadFile('external-order.csv');

    expect(await screen.findByText('RECEIPT NUMBER')).toBeVisible();

    helpers.confirmGrant();

    expect(await screen.findByText('Server busy')).toBeVisible();

    helpers.confirmGrant();

    expect(await screen.findByText('Successfully uploaded')).toBeVisible();
  });
});

function render() {
  renderWithConfig(<ExternalOrdersBulkUpdate />);

  return {
    openFileModal: () => user.click(screen.getByText('SELECT FILE')),
    uploadFile: (fileName: string) => {
      const csvFile = new File(['asdbc,sadfh,we9e8'], fileName, {
        type: 'text/csv',
      });

      user.upload(screen.getByTestId('file-selector'), csvFile);
      user.click(screen.getByText('SAVE CHANGES'));
    },
    confirmGrant: () => {
      user.click(screen.getByText('PROCESS GRANTING'));
      user.click(screen.getByText('CONFIRM'));
    },
  };
}
