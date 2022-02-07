import {screen, waitForElementToBeRemoved} from '@testing-library/react';
import user from '@testing-library/user-event';
import {rest} from 'msw';
import * as React from 'react';
import {environment} from 'src/environments/environment';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import {WalletBalanceGrantingListing} from './wallet-balance-granting-listing';

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<WalletBalanceGrantingListing />', () => {
  it('works for positive scenario', async () => {
    const {openFileModal, uploadFile, confirmUpload} = renderListing();

    expect(await screen.findAllByText('RAF RM100 for 18062020 - Copy.csv')).toHaveLength(2);

    openFileModal();
    uploadFile('new-file.csv');

    expect(await screen.findByText('user-1')).toBeVisible();

    confirmUpload();

    expect(screen.getByText('new-file.csv')).toBeVisible();

    expect(
      await screen.findByText('All grantings for new-file.csv are processed successfully.'),
    ).toBeVisible();

    expect(screen.queryByText('new-file.csv')).toBeNull();
  });

  it('can replace and remove selected file', async () => {
    const {openFileModal, uploadFile} = renderListing();

    openFileModal();
    uploadFile('new-file.csv');
    expect(screen.getByText('new-file.csv')).toBeVisible();

    user.click(await screen.findByLabelText('Replace file'));

    uploadFile('brand-new-file.csv');

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    expect(screen.getByText('brand-new-file.csv')).toBeVisible();
    expect(screen.queryByText('new-file.csv')).toBeNull();

    user.click(screen.getByLabelText('Remove file'));

    expect(screen.queryByText('brand-new-file.csv')).toBeNull();
  });

  it(
    'shows error when upload',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(
          `${environment.apiBaseUrl}/api/ops/wallet/upload-csv-bulk-wallet-granting`,
          (_, res, ctx) =>
            res(
              ctx.status(412),
              ctx.json({
                message: 'Error message from server',
              }),
            ),
        ),
      );

      const {openFileModal, uploadFile} = renderListing();

      openFileModal();
      uploadFile('new-file.csv');

      expect(await screen.findByText('Error message from server')).toBeVisible();
    }),
  );
});

function renderListing() {
  renderWithConfig(<WalletBalanceGrantingListing />);

  return {
    openFileModal: () => user.click(screen.getByText('SELECT FILE')),
    uploadFile: (fileName: string) => {
      const csvFile = new File(['asdbc,sadfh,we9e8'], fileName, {
        type: 'text/csv',
      });

      user.upload(screen.getByTestId('file-selector'), csvFile);
      user.click(screen.getByText('SAVE CHANGES'));
    },
    confirmUpload: () => {
      user.click(screen.getByText('UPLOAD FILE'));
      user.click(screen.getByText('CONFIRM'));
    },
  };
}
