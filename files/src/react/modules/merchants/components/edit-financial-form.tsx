import {Button, FieldContainer, ModalBody, ModalFooter, MoneyInput} from '@setel/portal-ui';
import * as React from 'react';
import {useUpdateMerchantDetails} from '../merchants.queries';
import {Merchant} from '../merchants.type';
import {MerchantBalanceType} from '../../../../shared/enums/merchant.enum';
import {QueryErrorAlert} from '../../../components/query-error-alert';

export const EditFinancialForm = (props: {
  merchantId: string;
  onDone: () => void;
  onCancel: () => void;
  merchant: Merchant;
}) => {
  const {merchant} = props;
  const {
    mutate: updateMerchant,
    error: updateError,
    isLoading,
  } = useUpdateMerchantDetails(props.merchantId);

  const [creditLimit, setCreditLimit] = React.useState(String(merchant.creditLimit || '0'));

  const prepaidBalanceObj = (merchant.balances || []).find(
    (balance) => balance.type === MerchantBalanceType.PREPAID,
  );

  const prepaidBalance = (prepaidBalanceObj && prepaidBalanceObj.balance) || 0;

  return (
    <form
      data-testid={'edit-financial-form'}
      onSubmit={(e) => {
        e.preventDefault();
        updateMerchant(
          {
            status: merchant.status,
            creditLimit: Number(creditLimit),
          },
          {
            onSuccess: props.onDone,
          },
        );
      }}>
      <ModalBody>
        {updateError && <QueryErrorAlert error={updateError as any} />}
        <FieldContainer
          layout={'horizontal-responsive'}
          label={'Credit limit'}
          className={updateError ? 'mt-2' : ''}>
          <MoneyInput
            className={'w-36'}
            disabled={isLoading}
            onChangeValue={setCreditLimit}
            value={creditLimit}
          />
        </FieldContainer>
        <FieldContainer layout={'horizontal-responsive'} label={'Prepaid balance'}>
          <MoneyInput className={'w-36'} disabled value={String(prepaidBalance)} />
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right">
        <Button onClick={props.onCancel} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button data-testid={'submit-btn'} type="submit" variant="primary" isLoading={isLoading}>
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </form>
  );
};
