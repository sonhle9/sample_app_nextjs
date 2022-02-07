import {Button, Dialog, JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {TransactionStatus, TransactionSubType} from 'src/shared/enums/wallet.enum';
import {ITransaction} from 'src/shared/interfaces/wallet.interface';
import {useRefundTopup, useWalletTopupDetails} from '../wallet-topup.queries';

export const WalletTopupDetails = (props: {id: string}) => {
  const {data, isFetching} = useWalletTopupDetails(props.id);

  const isTransactionRefundable = React.useMemo(
    () =>
      !!(
        data &&
        [
          TransactionSubType.TOPUP_BANK_ACCOUNT,
          TransactionSubType.TOPUP_CREDIT_CARD,
          TransactionSubType.TOPUP_DIGITAL_WALLET,
        ].includes(data.subType) &&
        data.status === TransactionStatus.SUCCEEDED &&
        !data.isRefundProcessing
      ),
    [data],
  );

  const [showRefundDialog, setshowRefundDialog] = React.useState(false);

  return (
    <PageContainer
      heading="Top-up Details"
      action={
        isTransactionRefundable && (
          <Button onClick={() => setshowRefundDialog(true)} variant="error" disabled={isFetching}>
            REFUND
          </Button>
        )
      }>
      {data && (
        <RefundDialog
          isOpen={showRefundDialog}
          onDismiss={() => setshowRefundDialog(false)}
          transaction={data}
        />
      )}
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};

const RefundDialog = (props: {
  transaction: ITransaction;
  isOpen: boolean;
  onDismiss: () => void;
}) => {
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const {mutate: refund, isLoading: isRefunding} = useRefundTopup(props.transaction);
  const showMsg = useNotification();

  return (
    <Dialog isOpen={props.isOpen} onDismiss={props.onDismiss} leastDestructiveRef={cancelBtnRef}>
      <Dialog.Content header="Refund Topup">
        Are you sure want to refund this top-up transaction?
      </Dialog.Content>
      <Dialog.Footer className="text-right space-x-3">
        <Button variant="outline" onClick={props.onDismiss} ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={() =>
            refund(undefined, {
              onSuccess: () => {
                showMsg({
                  title: 'Top-up refund is being processed',
                });
                props.onDismiss();
              },
            })
          }
          isLoading={isRefunding}
          variant="error">
          REFUND
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};
