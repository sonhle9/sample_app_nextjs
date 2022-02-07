import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from '@setel/portal-ui';
import {Formik} from 'formik';
import {IBnplAccount} from 'src/react/modules/bnpl-account/bnpl-account.type';
import {FormikDropdownField, FormikMoneyInput} from 'src/react/components/formik';
import * as Yup from 'yup';
import {accountStatusOptions} from 'src/react/modules/bnpl-account/bnpl-account.constant';
import {useUpdateStatusAndCreditLimitBnplAccount} from 'src/react/modules/bnpl-account/bnpl-account.queries';

const validationSchema = Yup.object({
  status: Yup.string().required('Required'),
  creditLimit: Yup.number().typeError('Required').required('Required').min(1).max(5000),
});

interface MyFormValues {
  status: string;
  creditLimit: number;
}

export const useBnplAccountDetailEditModal = (account: IBnplAccount) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  const initialValues = React.useMemo(
    () => ({
      status: account?.status ?? '',
      creditLimit: account?.creditLimit ?? null,
    }),
    [account],
  );

  const createBnplPlanMutation = useUpdateStatusAndCreditLimitBnplAccount();
  const isLoading = createBnplPlanMutation.isLoading;

  const submitHandler = (values: MyFormValues) => {
    createBnplPlanMutation.mutate(
      {
        id: account.id,
        status: values.status,
        creditLimit: parseFloat(values.creditLimit as unknown as string),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return {
    open: () => {
      setIsOpen(true);
    },
    component: (
      <Modal
        header="Edit general"
        isOpen={isOpen}
        onDismiss={onClose}
        aria-label="Create new plan"
        data-testid="create-new-plan">
        <Formik<MyFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}>
          {({handleSubmit}) => (
            <>
              <ModalBody>
                <FormikDropdownField
                  aria-label="accountStatus"
                  fieldName="status"
                  label="Account status"
                  options={accountStatusOptions}
                  className="w-56"
                />

                <FormikMoneyInput
                  fieldName="creditLimit"
                  label="Credit limit"
                  data-testid="creditLimit"
                  allowDecimalPlaces
                />
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button onClick={onClose} variant="outline" className="mr-2" disabled={isLoading}>
                  CANCEL
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}>
                  SAVE
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    ),
  };
};
