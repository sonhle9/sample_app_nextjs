import {Button, Dialog, ExternalIcon, JsonPanel, MiniCloseIcon, ReloadIcon} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useAuth} from 'src/react/modules/auth';
import {
  PaymentTransaction,
  TransactionStatus,
  TransactionSubType,
  TransactionType,
} from 'src/react/services/api-payments.type';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {
  useCancelAuthorizedTransaction,
  useTransactionDetails,
  useTransactionsByReferenceId,
} from '../payment-transactions.queries';

export interface PaymentsTransactionsDetailsProps {
  id: string;
}

export const PaymentsTransactionsDetails = (props: PaymentsTransactionsDetailsProps) => {
  const auth = useAuth();
  const hasReversePermission = React.useMemo(
    () => auth.roles.includes(transactionRole.reverse),
    [auth.roles],
  );

  const {data, error} = useTransactionDetails(props.id);

  return (
    <PageContainer
      heading="Payment transaction details"
      action={
        data && (
          <div className="space-x-3">
            <DetailsLink trx={data} />
            {hasReversePermission && <ReverseButton trx={data} />}
            {hasReversePermission && <CancelButton trx={data} />}
          </div>
        )
      }>
      {error && <QueryErrorAlert error={error as any} />}
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};

const ReverseButton = ({trx}: {trx: PaymentTransaction}) => {
  const show = React.useMemo(() => isGrantBalanceTransaction(trx), [trx]);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const {mutate: reverse, error, isLoading} = useCancelAuthorizedTransaction(trx);

  const dismissConfirmation = () => setShowConfirmation(false);

  return show ? (
    <>
      <Button onClick={() => setShowConfirmation(true)} variant="outline" leftIcon={<ReloadIcon />}>
        REVERSE
      </Button>
      <Dialog
        isOpen={showConfirmation}
        onDismiss={dismissConfirmation}
        leastDestructiveRef={cancelBtnRef}>
        <Dialog.Content header="Are you sure you want to void this Grant Wallet Balance transaction?">
          {error && (
            <QueryErrorAlert error={error as any} description="Error reversing transaction" />
          )}
        </Dialog.Content>
        <Dialog.Footer className="text-right space-x-3">
          <Button onClick={dismissConfirmation} ref={cancelBtnRef} variant="outline">
            CANCEL
          </Button>
          <Button
            onClick={() =>
              reverse(undefined, {
                onSuccess: dismissConfirmation,
              })
            }
            variant="primary"
            isLoading={isLoading}>
            CONFIRM
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  ) : null;
};

const CancelButton = ({trx}: {trx: PaymentTransaction}) => {
  const show = React.useMemo(() => isAuthorizedTransaction(trx), [trx]);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const {mutate, error, isLoading} = useCancelAuthorizedTransaction(trx);

  const dismissConfirmation = () => setShowConfirmation(false);

  return show ? (
    <>
      <Button
        onClick={() => setShowConfirmation(true)}
        variant="error"
        leftIcon={<MiniCloseIcon />}>
        CANCEL
      </Button>
      <Dialog
        isOpen={showConfirmation}
        onDismiss={dismissConfirmation}
        leastDestructiveRef={cancelBtnRef}>
        <Dialog.Content header="Are you sure you want to cancel this authorized transaction?">
          {error && (
            <QueryErrorAlert error={error as any} description="Error cancelling transaction" />
          )}
        </Dialog.Content>
        <Dialog.Footer className="text-right space-x-3">
          <Button onClick={dismissConfirmation} ref={cancelBtnRef} variant="outline">
            CANCEL
          </Button>
          <Button
            onClick={() =>
              mutate(undefined, {
                onSuccess: dismissConfirmation,
              })
            }
            variant="primary"
            isLoading={isLoading}>
            CONFIRM
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  ) : null;
};

const DetailsLink = ({trx}: {trx: PaymentTransaction}) => {
  const {data} = useTransactionsByReferenceId(trx);

  const linkDetails = React.useMemo(() => {
    if (!data || !trx) {
      return undefined;
    }

    const walletTrx = data[0];

    if (!walletTrx) {
      return undefined;
    }

    switch (trx.type) {
      case TransactionType.topup: {
        if (trx.subtype === TransactionSubType.rewards) {
          return {
            url: `/payments/transfers/${walletTrx.transactionUid}`,
            pageName: 'Transfer Transaction Detail',
          };
        } else {
          return {
            url: `/wallet/topups/${walletTrx.transactionUid}`,
            pageName: 'Top-up Transaction Detail',
          };
        }
      }

      case TransactionType.purchase:
      case TransactionType.authorize:
      case TransactionType.capture: {
        return {
          url: `${CURRENT_ENTERPRISE.dashboardUrl}/payments/transactions?merchantId=${walletTrx.merchantId}&transactionId=${walletTrx.transactionUid}&redirect-from=admin`,
          pageName: 'Charge Transaction Detail',
        };
      }

      case TransactionType.topup_refund:
        return {
          url: `/wallet/topup-refunds/${walletTrx.transactionUid}`,
          pageName: 'Top-up Refund Transaction Detail',
        };

      default:
        break;
    }
  }, [data]);

  return linkDetails ? (
    <Button
      variant="outline"
      className="uppercase"
      render={(props) => (
        <a href={linkDetails.url} target="_BLANK" rel="noopener noreferrer" {...props}></a>
      )}
      leftIcon={<ExternalIcon />}>
      {linkDetails.pageName}
    </Button>
  ) : null;
};

const isGrantBalanceTransaction = (trx: PaymentTransaction) =>
  (trx.subtype === TransactionSubType.rewards ||
    trx.subtype === TransactionSubType.redeemLoyaltyPoints) &&
  trx.type === TransactionType.topup &&
  (trx.status === TransactionStatus.success || trx.status === TransactionStatus.incoming);

const isAuthorizedTransaction = (trx: PaymentTransaction) =>
  trx.type === TransactionType.authorize && trx.status === TransactionStatus.success;
