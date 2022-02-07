import {Button, PlusIcon} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useCreateStoreProduct} from '../stores.queries';
import {IProduct, INITIAL_PRODUCT} from '../stores.types';
import {ProductModal} from './product-form';

export interface IProductCreateProps {
  storeId: string;
  onSuccess?: (product?: IProduct) => void;
}
export function ProductCreate({storeId, onSuccess}: IProductCreateProps) {
  const initialProduct = React.useMemo(
    () => ({
      ...INITIAL_PRODUCT,
      storeId,
    }),
    [storeId],
  );
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const showMessage = useNotification();
  const createProduct = useCreateStoreProduct({
    onSuccess(data) {
      showMessage({
        title: 'Store item created successfully!',
      });
      createProduct.reset();
      setShowForm(false);
      onSuccess?.(data);
    },
  });
  const onSave = (product: IProduct, imgFile: File) => {
    createProduct.mutate({
      product: {
        ...product,
        storeId,
        price: Number(product.price),
      },
      imgFile,
    });
  };
  return (
    <>
      <Button
        variant="primary"
        disabled={!storeId}
        onClick={() => setShowForm(true)}
        leftIcon={<PlusIcon />}
        data-testid="btn-create">
        ADD ITEM
      </Button>
      {showForm && (
        <ProductModal
          header={'Add new item'}
          toggleOpen={setShowForm}
          initialValues={initialProduct}
          onSave={onSave}
          mutationResult={createProduct}
        />
      )}
    </>
  );
}
