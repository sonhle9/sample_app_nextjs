import {
  Button,
  DescItem,
  DescList,
  FieldContainer,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextareaField,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {AuthContext} from 'src/react/modules/auth';
import {computeMerchantAvailableBalance} from '../merchants.lib';
import {useCreateMerchantAdjustment} from '../merchants.queries';
import {Merchant} from '../merchants.type';

export interface MerchantAdjustBalanceModalProps {
  isOpen: boolean;
  merchant: Merchant;
  onDismiss: () => void;
}

export const MerchantAdjustBalanceModal = (props: MerchantAdjustBalanceModalProps) => {
  const {session} = React.useContext(AuthContext);
  const {mutate, isLoading: isSubmitting} = useCreateMerchantAdjustment(props.merchant.id);

  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues,
    onSubmit: (adjustValues) => {
      if (adjustValues.amount !== '-' && adjustValues.amount !== '-0' && adjustValues.amount) {
        mutate(
          {
            amount: Number(adjustValues.amount),
            attributes: {
              comment: adjustValues.comment,
            },
            userId: session && session.sub,
          },
          {
            onSuccess: props.onDismiss,
          },
        );
      }
    },
  });

  const title = 'Adjust merchant balance';

  return (
    <Modal isOpen={props.isOpen} onDismiss={props.onDismiss} aria-label={title}>
      <ModalHeader>{title}</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <DescList className="mb-4">
            <DescItem label="Merchant" value={props.merchant.name} />
            <DescItem
              label="Balance"
              value={formatMoney(computeMerchantAvailableBalance(props.merchant))}
            />
          </DescList>
          <div className="pt-4 border-t border-grey-500">
            <FieldContainer label="Adjustment value" layout="horizontal-responsive">
              <MoneyInput
                value={values.amount}
                onChangeValue={(v) => setFieldValue('amount', v)}
                allowNegative
              />
            </FieldContainer>
            <TextareaField
              label="Comment"
              value={values.comment}
              onChangeValue={(v) => setFieldValue('comment', v)}
              layout="horizontal-responsive"
            />
          </div>
        </ModalBody>
        <ModalFooter className="text-right space-x-3">
          <Button onClick={props.onDismiss} variant="outline" disabled={isSubmitting}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            SUBMIT
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

interface AdjustBalanceValues {
  amount: string;
  comment: string;
}

const initialValues: AdjustBalanceValues = {
  amount: '',
  comment: '',
};
