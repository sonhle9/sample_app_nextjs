import {screen} from '@testing-library/react';
import * as React from 'react';
import {environment} from 'src/environments/environment';
import {server} from 'src/react/services/mocks/mock-server';
import {rest} from 'msw';
import user from '@testing-library/user-event';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {ProductEdit} from './product-edit';
import {IProduct, ProductCategoriesEnum} from '../stores.types';

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
  itemId: 'abc123',
};

describe(`<ProductEdit />`, () => {
  it('submit form with product details', async () => {
    server.use(
      rest.put(`${environment.storeApiBaseUrl}/api/stores/admin/items/:id`, (_, res, ctx) => {
        return res(ctx.status(201), ctx.json({}));
      }),
    );

    renderWithConfig(<ProductEdit initialProduct={SAMPLE_PRODUCT} />);

    const btnCreate = await screen.findByTestId('btn-edit');
    user.click(btnCreate);

    const txtBarcode = await screen.findByTestId('txt-barcode');
    user.type(txtBarcode, SAMPLE_PRODUCT.barcode);

    const txtName = await screen.findByTestId('txt-name');
    user.type(txtName, SAMPLE_PRODUCT.name);

    const txtPrice = await screen.findByTestId('txt-price');
    user.type(txtPrice, String(SAMPLE_PRODUCT.price));

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);

    const successNotification = await screen.findByText(/item updated/i);
    expect(successNotification).toBeDefined();
  });

  it(
    'show error when API call fails',
    suppressConsoleLogs(async () => {
      server.use(
        rest.put(`${environment.storeApiBaseUrl}/api/stores/admin/items/:id`, (_, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }),
      );

      renderWithConfig(<ProductEdit initialProduct={SAMPLE_PRODUCT} />);

      const btnCreate = await screen.findByTestId('btn-edit');
      user.click(btnCreate);

      const txtBarcode = await screen.findByTestId('txt-barcode');
      user.type(txtBarcode, SAMPLE_PRODUCT.barcode);

      const txtName = await screen.findByTestId('txt-name');
      user.type(txtName, SAMPLE_PRODUCT.name);

      const txtPrice = await screen.findByTestId('txt-price');
      user.type(txtPrice, String(SAMPLE_PRODUCT.price));

      const btnSave = await screen.findByTestId('btn-save');
      user.click(btnSave);

      const errorNotification = await screen.findByText(/error occured/i);
      expect(errorNotification).toBeDefined();
    }),
  );
});
