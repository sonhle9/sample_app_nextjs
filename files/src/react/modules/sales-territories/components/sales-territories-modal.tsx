import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useRouter} from '../../../routing/routing.context';
import {emailRegex} from '../../merchants/merchant.const';
import {useDeleteSalesTerritory, useSetSalesTerritory} from '../sales-territories.queries';
import {ISalesTerritory, SalesTerritoryModalMessage} from '../sales-territories.type';

interface SalesTerritoryModalProps {
  merchantTypeId?: string;
  salesTerritory?: ISalesTerritory;
  onClose?: (string, err?) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  code: Yup.string().required('Code is required'),
  salesPersonEmail: Yup.string().nullable().matches(emailRegex, 'Email address invalid'),
});

export const SalesTerritoryModal = (props: SalesTerritoryModalProps) => {
  const enterpriseId = CURRENT_ENTERPRISE.name;
  const merchantTypeId = props.merchantTypeId || props.salesTerritory.merchantTypeId;
  const title = !!props.salesTerritory ? 'Edit sales territory details' : 'Create sales territory';

  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const {mutate: setSalesTerritory, error: submitError} = useSetSalesTerritory(
    props.merchantTypeId,
    props.salesTerritory,
  );
  const {mutate: deleteSalesTerritory} = useDeleteSalesTerritory(props.salesTerritory);

  const router = useRouter();
  const onDeleteSalesTerritory = () => {
    deleteSalesTerritory(props.salesTerritory.id, {
      onSuccess: () => {
        setVisibleDeleteConfirm(false);
        props.onClose(SalesTerritoryModalMessage.DELETE_SUCCESS);
        router.navigateByUrl(`merchant-types/${merchantTypeId}`);
      },
      onError: (err: any) => {
        props.onClose(SalesTerritoryModalMessage.DELETE_ERROR, err);
      },
    });
  };

  const {values, touched, errors, handleSubmit, setFieldValue, handleBlur} = useFormik({
    initialValues: {
      name: props.salesTerritory?.name,
      code: props.salesTerritory?.code,
      salesPersonEmail: props.salesTerritory?.salesPersonEmail,
    },
    validationSchema,
    onSubmit: () => {
      setSalesTerritory(
        {
          ...values,
          ...(!values.salesPersonEmail && {
            salesPersonEmail: null,
          }),
          merchantTypeId,
          enterpriseId,
        },
        {
          onSuccess: () => {
            props.onClose(SalesTerritoryModalMessage.EDIT_SUCCESS);
          },
        },
      );
    },
  });

  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {submitError && <QueryErrorAlert error={submitError as any} />}
            <TextField
              className={!!submitError ? 'mt-2' : ''}
              label={'Name'}
              name={'name'}
              value={values.name}
              onBlur={handleBlur}
              onChangeValue={(v) => setFieldValue('name', v)}
              maxLength={128}
              status={touched.name && errors.name ? 'error' : undefined}
              helpText={touched.name ? errors.name : null}
              layout={'horizontal-responsive'}
              placeholder={`Enter name`}
            />
            <TextField
              className={!!submitError ? 'mt-2' : ''}
              label={'Code'}
              name={'code'}
              value={values.code}
              onBlur={handleBlur}
              onChangeValue={(v) => setFieldValue('code', v)}
              maxLength={128}
              status={touched.code && errors.code ? 'error' : undefined}
              helpText={touched.code ? errors.code : null}
              layout={'horizontal-responsive'}
              placeholder={`Enter code`}
            />
            <TextField
              className={!!submitError ? 'mt-2' : ''}
              label={'Sales person email'}
              name={'salesPersonEmail'}
              value={values.salesPersonEmail}
              onBlur={handleBlur}
              onChangeValue={(v) => setFieldValue('salesPersonEmail', v)}
              maxLength={128}
              status={touched.salesPersonEmail && errors.salesPersonEmail ? 'error' : undefined}
              helpText={touched.salesPersonEmail ? errors.salesPersonEmail : null}
              layout={'horizontal-responsive'}
              placeholder={`Enter sales person email`}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {!!props.salesTerritory ? (
                <span
                  style={{color: 'red', cursor: 'pointer'}}
                  onClick={() => setVisibleDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onClose}>
                  CANCEL
                </Button>
                <Button className="ml-4" type={'submit'} variant="primary">
                  {props.salesTerritory ? 'SAVE CHANGES' : 'SAVE'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {visibleDeleteConfirm && (
        <Dialog onDismiss={() => setVisibleDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Delete sales territory">
            Are you sure you would like to delete this sales territory? The action can not be
            undone?
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibleDeleteConfirm(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteSalesTerritory}>
              CONFIRM
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
