import {screen} from '@testing-library/react';
import * as React from 'react';
import user from '@testing-library/user-event';

import {renderWithConfig} from '../../../lib/test-helper';
import {ProductModal} from './product-form';
import {IProduct, IStoreError, ProductCategoriesEnum} from '../stores.types';
import {UseMutationResult} from 'react-query';
import {AxiosError} from 'axios';

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

const mutationResult: UseMutationResult<IProduct, AxiosError<IStoreError>> = {
  status: 'idle',
  data: null,
  error: undefined,
  isIdle: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
  reset: () => {},
} as any;

describe(`<ProductModal />`, () => {
  it('show error when input fails validation', async () => {
    renderWithConfig(
      <ProductModal
        header={'Add new item'}
        toggleOpen={() => {}}
        initialValues={SAMPLE_PRODUCT}
        onSave={() => {}}
        mutationResult={mutationResult}
      />,
    );

    const txtBarcode = await screen.findByTestId('txt-barcode');
    user.type(txtBarcode, '[[$pecial character$]');

    const txtName = await screen.findByTestId('txt-name');
    user.type(txtName, '[[$pecial character$]');

    const txtPrice = await screen.findByTestId('txt-price');
    user.type(txtPrice, String(1000));

    const txtRank = await screen.findByTestId('txt-rank');
    user.type(txtRank, String(1000));

    const txtMaxQuantity = await screen.findByTestId('txt-max-quantity');
    user.type(txtMaxQuantity, String(100));

    const btnSave = await screen.findByTestId('btn-save');
    user.click(btnSave);

    expect((await screen.findAllByText(/not allowed/i)).length).toBe(2);
    expect(await screen.findByText(/Price must be less than RM1000/i)).toBeDefined();
    expect(await screen.findByText(/Rank must be less than 1000/i)).toBeDefined();
    expect(await screen.findByText(/Max quantity must be less than 100/i)).toBeDefined();
    expect((btnSave as HTMLButtonElement).disabled).toBe(true);
  });
});
