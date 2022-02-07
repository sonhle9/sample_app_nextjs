import {Button, EditIcon} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useUpdateStoreProduct} from '../stores.queries';
import {IProduct} from '../stores.types';
import {ProductModal} from './product-form';

export interface IProductEditProps {
  initialProduct: IProduct;
  onSuccess?: (product: IProduct) => void;
}
export function ProductEdit({initialProduct, onSuccess}: IProductEditProps) {
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const showMessage = useNotification();
  const updateProduct = useUpdateStoreProduct({
    onSuccess(data) {
      showMessage({
        title: 'Store item updated successfully!',
      });
      updateProduct.reset();
      setShowForm(false);
      onSuccess?.(data);
    },
  });
  const onSave = (product: IProduct, imgFile: File) => {
    updateProduct.mutate({
      product: {
        ...product,
        price: Number(product.price),
      },
      imgFile,
    });
  };
  return (
    <>
      <Button
        variant="outline"
        minWidth="small"
        disabled={!initialProduct.itemId}
        onClick={() => setShowForm(true)}
        leftIcon={<EditIcon />}
        data-testid="btn-edit">
        EDIT
      </Button>
      {showForm && (
        <ProductModal
          header={'Edit item'}
          toggleOpen={setShowForm}
          initialValues={initialProduct}
          onSave={onSave}
          mutationResult={updateProduct}
          validateOnMount
        />
      )}
    </>
  );
}
