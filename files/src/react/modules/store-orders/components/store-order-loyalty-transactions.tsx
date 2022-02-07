import * as React from 'react';
import {
  Alert,
  Button,
  CardHeading,
  DataTable as Table,
  Dialog,
  DropdownMenu,
  FieldContainer,
  formatDate,
  formatMoney,
  Modal,
  MoneyInput,
  PaginationNavigation,
  usePaginationState,
} from '@setel/portal-ui';
import {useIndexTransactions, useRetryGrantPetronasPoints} from '../../loyalty/loyalty.queries';
import {getLoyaltyAmount} from 'src/shared/helpers/get-loyalty-amount';
import {Link} from 'src/react/routing/link';

export function StoreOrderLoyaltyTransactions(props: {orderId: string}) {
  const pagination = usePaginationState();
  const {
    data: transactions,
    isLoading,
    isSuccess,
  } = useIndexTransactions({
    referenceId: props.orderId,
    page: pagination.page,
    perPage: pagination.perPage,
  });
  return (
    <div className="mb-8">
      <Table
        pagination={
          <PaginationNavigation
            total={transactions?.metadata?.totalCount}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        }
        isLoading={isLoading}
        heading={
          <CardHeading title="Loyalty transactions">
            <StoreOrderLoyaltyPointsIssuance orderId={props.orderId} />
          </CardHeading>
        }
        data-testid="store-order-loyalty-transactions">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="w-3/12">Title</Table.Th>
            <Table.Th className="w-2/12 text-right">Points</Table.Th>
            <Table.Th className="w-2/12">Issued by</Table.Th>
            <Table.Th className="w-3/12">Error message</Table.Th>
            <Table.Th className="w-2/12 text-right">Created On</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {transactions?.data?.map((transaction) => (
            <Table.Tr key={transaction.id}>
              <Table.Td>
                <Link
                  className="hover:text-brand-500"
                  to={`/payments/transactions/loyalty/${transaction.id}`}>
                  {transaction.title}
                </Link>
              </Table.Td>
              <Table.Td className="text-right">{getLoyaltyAmount(transaction) || '-'}</Table.Td>
              <Table.Td className="uppercase">{transaction.issuedBy}</Table.Td>
              <Table.Td>
                {transaction.failureReason || transaction.vendorFailureReason || '-'}
              </Table.Td>
              <Table.Td className="text-right">{formatDate(transaction.createdAt)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        {isSuccess && transactions?.data?.length === 0 && (
          <Table.Caption className="text-center text-darkgrey py-8">
            Order does not have any loyalty transactions
          </Table.Caption>
        )}
      </Table>
    </div>
  );
}

function StoreOrderLoyaltyPointsIssuance(props: {orderId: string}) {
  const [issuanceType, setIssuanceType] = React.useState<null | 'amount' | 'invoice'>(null);
  const onDismiss = () => setIssuanceType(null);
  return (
    <>
      <DropdownMenu variant="outline" label="ACTIONS">
        <DropdownMenu.Items className="min-w-32">
          <DropdownMenu.Item onSelect={() => setIssuanceType('amount')}>
            Issue points by amount
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setIssuanceType('invoice')}>
            Issue points by invoice
          </DropdownMenu.Item>
        </DropdownMenu.Items>
      </DropdownMenu>
      {issuanceType === 'amount' && (
        <StoreOrderLoyaltyPointsIssuanceByAmount orderId={props.orderId} onDismiss={onDismiss} />
      )}
      {issuanceType === 'invoice' && (
        <StoreOrderLoyaltyPointsIssuanceByInvoice orderId={props.orderId} onDismiss={onDismiss} />
      )}
    </>
  );
}

function StoreOrderLoyaltyPointsIssuanceByAmount(props: {orderId: string; onDismiss: () => void}) {
  const [amount, setAmount] = React.useState('0');
  const [showConfirm, setShowConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);
  const {
    mutate: onConfirm,
    error,
    isLoading,
  } = useRetryGrantPetronasPoints(props.orderId, {
    onSuccess: () => {
      props.onDismiss();
    },
  });
  return (
    <>
      <Modal
        header="Issue points by amount"
        isOpen
        onDismiss={() => props.onDismiss()}
        initialFocus="content">
        <Modal.Body>
          <FieldContainer label="Amount" layout="horizontal-responsive">
            <MoneyInput value={amount} onChangeValue={setAmount} />
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button onClick={() => props.onDismiss()} variant="outline" className="mr-4">
            CANCEL
          </Button>
          <Button
            disabled={Number(amount) === 0 || isLoading}
            onClick={() => setShowConfirm(true)}
            variant="primary">
            CONTINUE
          </Button>
        </Modal.Footer>
      </Modal>
      {showConfirm && (
        <Dialog onDismiss={() => setShowConfirm(false)} leastDestructiveRef={cancelRef}>
          <Dialog.Content
            header={`Are you sure you want to proceed with issue point by amount of ${formatMoney(
              amount,
              'RM',
            )}?`}>
            You are about to issue {formatMoney(amount, 'RM')}. Click confirm to proceed.
            {error && (
              <Alert
                className="mt-4"
                variant="error"
                description={`${error.response?.status} : ${
                  error.response?.data?.message || error.message
                }`}
              />
            )}
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setShowConfirm(false)} ref={cancelRef}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              isLoading={isLoading}
              onClick={() => onConfirm(Number(amount))}>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
}

function StoreOrderLoyaltyPointsIssuanceByInvoice(props: {orderId: string; onDismiss: () => void}) {
  const cancelRef = React.useRef(null);
  const {
    mutate: onConfirm,
    error,
    isLoading,
  } = useRetryGrantPetronasPoints(props.orderId, {
    onSuccess: () => {
      props.onDismiss();
    },
  });
  return (
    <Dialog onDismiss={() => props.onDismiss()} leastDestructiveRef={cancelRef}>
      <Dialog.Content header={`Are you sure you want to proceed with issue point by invoice?`}>
        You are about to issue point by invoice. Click confirm to proceed.
        {error && (
          <Alert
            className="mt-4"
            variant="error"
            description={`${error.response?.status} : ${
              error.response?.data?.message || error.message
            }`}
          />
        )}
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outline" onClick={() => props.onDismiss()} ref={cancelRef}>
          CANCEL
        </Button>
        <Button
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={() => onConfirm(null)}>
          CONFIRM
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
