import * as React from 'react';
import {AxiosError} from 'axios';
import {useFormik} from 'formik';
import {UseMutationResult} from 'react-query';
import {
  Alert,
  AlertMessages,
  Button,
  FieldContainer,
  FieldStatus,
  FileSelector,
  ImageThumbnail,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextField,
  ToggleField,
} from '@setel/portal-ui';
import {PRODUCT_SCHEMA} from '../stores.schema';
import {IProduct, IStoreError} from '../stores.types';

export interface IProductModalProps {
  header: React.ReactNode;
  toggleOpen: (isOpen: boolean) => void;
  initialValues: IProduct;
  validateOnMount?: boolean;
  onSave: (product: IProduct, imgFile: File) => void;
  mutationResult: UseMutationResult<IProduct, AxiosError<IStoreError>>;
}
export function ProductModal({
  header,
  toggleOpen,
  initialValues,
  onSave,
  mutationResult,
  validateOnMount,
}: IProductModalProps) {
  const [imgFile, setImgFile] = React.useState<File>(null);
  const {isLoading, error} = mutationResult;

  const onCancel = () => {
    formik.resetForm();
    toggleOpen(false);
  };

  const formik = useFormik<IProduct>({
    initialValues,
    validateOnMount,
    validationSchema: PRODUCT_SCHEMA,
    onSubmit(values) {
      onSave(values, imgFile);
    },
  });

  const onFilesSelected = (newFiles: File[]) => {
    const file = newFiles[0];
    const fileSizeMb = file.size / 1024 / 1024;
    formik.setFieldTouched('image', true, false);
    if (fileSizeMb > 1) {
      formik.setFieldError(
        'image',
        `File size is too big (${Math.ceil(fileSizeMb * 10) / 10} MB).`,
      );
      formik.setFieldValue('image', '', false);
      setImgFile(null);
    } else {
      formik.setFieldError('image', undefined);
      formik.setFieldValue('image', file.name);
      setImgFile(file);
    }
  };

  const getHelpText = (attr: keyof IProduct) => {
    return (formik.values[attr] || formik.touched[attr]) && formik.errors[attr];
  };
  const getFieldStatus = (attr: keyof IProduct): FieldStatus => {
    return getHelpText(attr) ? 'error' : undefined;
  };

  return (
    <Modal isOpen={true} onDismiss={() => toggleOpen(false)} aria-label="Product Form">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody>
        {error && (
          <Alert
            className="mb-4"
            variant="error"
            description="Error occured while creating new store item!">
            <AlertMessages messages={[error?.response?.data?.message || String(error)]} />
          </Alert>
        )}
        <TextField
          label={'Barcode'}
          name={'barcode'}
          value={formik.values.barcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          layout={'horizontal'}
          status={getFieldStatus('barcode')}
          helpText={getHelpText('barcode')}
          data-testid="txt-barcode"
        />
        <FieldContainer
          label={'Image'}
          labelAlign={'start'}
          layout={'horizontal'}
          status={getFieldStatus('image')}
          helpText={getHelpText('image')}>
          {!imgFile && formik.values.image && (
            <ImageThumbnail
              className="my-1"
              src={formik.values.image}
              onDelete={() => formik.setFieldValue('image', '')}
            />
          )}
          {imgFile && (
            <ImageThumbnail
              className="my-1"
              file={imgFile}
              onDelete={() => {
                setImgFile(null);
                formik.setFieldValue('image', '');
              }}
            />
          )}
          {!imgFile && !formik.values.image && (
            <FileSelector
              className="-mx-1"
              onFilesSelected={onFilesSelected}
              fileType="image"
              description="PNG, JPG, GIF up to 1MB"
              data-testid="file-image"
            />
          )}
        </FieldContainer>
        <TextField
          label={'Name'}
          name={'name'}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          layout={'horizontal'}
          status={getFieldStatus('name')}
          helpText={getHelpText('name')}
          data-testid="txt-name"
        />
        <FieldContainer
          label={'Price'}
          layout={'horizontal'}
          status={getFieldStatus('price')}
          helpText={getHelpText('price')}>
          <MoneyInput
            name={'price'}
            value={String(formik.values.price)}
            onChangeValue={(value) => formik.setFieldValue('price', value, true)}
            onBlur={formik.handleBlur}
            data-testid="txt-price"
          />
        </FieldContainer>
        <FieldContainer
          label={'Availability'}
          layout={'horizontal'}
          status={getFieldStatus('isAvailable')}
          helpText={getHelpText('isAvailable')}>
          <ToggleField
            label={formik.values.isAvailable ? 'Available' : 'Unavailable'}
            on={formik.values.isAvailable}
            onChangeValue={(value) => formik.setFieldValue('isAvailable', value)}
            data-testid="tgl-availability"
          />
        </FieldContainer>
        <TextField
          label={'Rank'}
          name={'rank'}
          value={formik.values.rank}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="number"
          layout={'horizontal'}
          status={getFieldStatus('rank')}
          helpText={getHelpText('rank')}
          data-testid="txt-rank"
        />
        <TextField
          name={'maxQuantity'}
          value={formik.values.maxQuantity}
          label={'Max quantity'}
          layout={'horizontal'}
          type="number"
          status={getFieldStatus('maxQuantity')}
          helpText={getHelpText('maxQuantity')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          data-testid="txt-max-quantity"
        />
      </ModalBody>
      <ModalFooter className="text-right space-x-3">
        <Button disabled={isLoading} variant="outline" onClick={onCancel} data-testid="btn-cancel">
          CANCEL
        </Button>
        <Button
          disabled={!formik.isValid}
          isLoading={isLoading}
          variant="primary"
          onClick={() => formik.submitForm()}
          data-testid="btn-save">
          SAVE ITEM
        </Button>
      </ModalFooter>
    </Modal>
  );
}
