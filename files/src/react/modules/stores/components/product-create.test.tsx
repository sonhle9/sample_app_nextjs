import {screen} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {ProductCreate} from './product-create';
import {IProduct, ProductCategoriesEnum} from '../stores.types';
import {environment} from 'src/environments/environment';

const SAMPLE_PRODUCT: IProduct = {
  storeId: 'abc123',
  barcode: '1234567890',
  image:
    'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/stores/Taman+Tun+Dr+Ismail+-+Mesra/image-01.png',
  name: 'Test product',
  price: 1,
  isAvailable: true,
  rank: 1,
  maxQuantity: 1,
  currency: 'RM',
  category: ProductCategoriesEnum.FOOD,
  belongsTo: '',
  tax: 0,
};

describe(`<ProductCreate />`, () => {
  const fillUpAndSubmitForm = async () => {
    const btnCreate = await screen.findByTestId('btn-create');
    user.click(btnCreate);

    const txtBarcode = await screen.findByTestId('txt-barcode');
    user.type(txtBarcode, SAMPLE_PRODUCT.barcode);

    const imgFile = new File(['hello'], 'hello.png', {
      type: 'image/png',
    });
    const fileImg = await screen.findByTestId('file-image');
    user.upload(fileImg as HTMLInputElement, imgFile);

    const txtName = await screen.findByTestId('txt-name');
    user.type(txtName, SAMPLE_PRODUCT.name);

    const txtPrice = await screen.findByTestId('txt-price');
    user.type(txtPrice, String(SAMPLE_PRODUCT.price));

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);
  };

  it('submit form with product details', async () => {
    server.use(
      rest.post(`${environment.storeApiBaseUrl}/api/stores/admin/items`, (_, res, ctx) => {
        return res(ctx.status(201), ctx.json({}));
      }),
    );

    renderWithConfig(<ProductCreate storeId={SAMPLE_PRODUCT.storeId} />);

    await fillUpAndSubmitForm();
    const successNotification = await screen.findByText(/item created/i);
    expect(successNotification).toBeDefined();
  });

  it(
    'unsuccessfully submit form with product details',
    suppressConsoleLogs(async () => {
      server.use(
        rest.post(`${environment.storeApiBaseUrl}/api/stores/admin/items`, (_, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }),
      );

      renderWithConfig(<ProductCreate storeId={SAMPLE_PRODUCT.storeId} />);

      await fillUpAndSubmitForm();
      const errorNotification = await screen.findByText(/error occured/i);
      expect(errorNotification).toBeDefined();
    }),
  );
});
