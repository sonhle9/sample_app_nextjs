import {
  DescList,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableRow as ExpandableRow,
  Badge,
  titleCase,
  DescItem,
  Skeleton,
  Card,
  ExternalIcon,
} from '@setel/portal-ui';
import moment from 'moment';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {PaymentTransaction} from 'src/react/services/api-payments.type';
import {getPaymentMethod} from '../../payments-transactions/payment-transactions.lib';
import {useStations} from '../../stations/stations.queries';
import {StationStatusColorMap, TransactionStatusColorMap} from '../customers.constant';
import {convertSnakeCaseToSentence} from '../customers.helper';
import {usePaymentTransactions, usePaymentTransactionDetails} from '../customers.queries';
import {ICustomerTransactions} from '../customers.type';

interface DisplayStationStatusProps {
  stationName: string;
}
interface ICustomer {
  customerId: string;
}

function DisplayStationStatus({stationName}: DisplayStationStatusProps) {
  const {data: stations, isLoading: isLoading} = useStations(
    {name: stationName},
    {enabled: !!stationName},
  );
  const foundStation = stations?.items?.find((result) => result.name === stationName);
  if (!stationName) {
    return <>{'-'}</>;
  }
  if (isLoading) {
    return <Skeleton />;
  }
  if (foundStation) {
    return (
      <>
        {stationName + ' '}
        <Link className="inline text-base" to={`/stations/${foundStation.id}/details`}>
          <ExternalIcon className="inline" color="#00b0ff" />
        </Link>{' '}
        <Badge className="uppercase" color={StationStatusColorMap[foundStation.status]}>
          {foundStation.status}
        </Badge>
      </>
    );
  }
}
export function LatestPaymentTransactions({customerId: customerId}: ICustomer) {
  const customerTransactionsInput: ICustomerTransactions = {
    userId: customerId,
    page: 1,
    perPage: 4,
  };

  const {
    data: customerTransactions,
    isLoading: isLoading,
    error: customerTransactionsError,
  } = usePaymentTransactions(customerTransactionsInput, {
    retry: (retryCount, error) => {
      return retryCount < 3 && error?.message !== 'Transaction not found';
    },
  });

  return (
    <Card data-testid="payment-transaction-section" className="w-full min-h-64">
      <Card.Heading title="Latest payment transaction" />
      {customerTransactionsError?.message === 'Transaction not found' ? (
        <div className="text-lg text-mediumgrey text-center py-10 w-full">
          Customer does not have any transactions
        </div>
      ) : (
        <>
          <DataTable native isLoading={isLoading} skeletonRowNum={3}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>TRANSACTION ID</Td>
                <Td>STATUS</Td>
                <Td>TYPE</Td>
                <Td>CREATED ON</Td>
                <Td>PAYMENT METHOD</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {customerTransactions &&
                customerTransactions.map((transaction) => (
                  <TransactionRow {...transaction} key={transaction.id} />
                ))}
            </DataTableRowGroup>
          </DataTable>
          {customerTransactions && (
            <Link
              className="text-base my-2 text-brand-500 text-center"
              to={`/customers/${customerId}?tabIndex=3`}>
              <strong>SEE MORE</strong>
            </Link>
          )}
        </>
      )}
    </Card>
  );
}
const TransactionRow = (transaction: PaymentTransaction) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const {data: transactionDetails} = usePaymentTransactionDetails(transaction.id, {
    enabled: isExpanded,
  });

  return (
    <ExpandGroup data-testid="payment-transaction">
      <Tr>
        <Td>
          <ExpandButton
            data-testid="expand-transaction-button"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Link className="inline" to={`/payments/transactions/details/${transaction.id}`}>
            {transaction.id}
          </Link>
        </Td>
        <Td>
          <Badge color={TransactionStatusColorMap[transaction.status]} className="uppercase">
            {transaction.status}
          </Badge>
        </Td>
        <Td>{titleCase(transaction.type)}</Td>
        <Td>{moment(transaction.createdAt).format('DD  MMM YYYY, h:mm a')}</Td>
        <Td>{getPaymentMethod(transaction)}</Td>
      </Tr>
      <ExpandableRow>
        <DescList>
          {
            <DescItem
              label="Reference type"
              value={
                transactionDetails ? (
                  convertSnakeCaseToSentence(transactionDetails.referenceType) ||
                  transactionDetails.subtype
                ) : (
                  <Skeleton />
                )
              }
            />
          }
          <DescItem
            label="Station name"
            value={
              transactionDetails ? (
                <DisplayStationStatus stationName={transactionDetails.stationName} />
              ) : (
                <Skeleton />
              )
            }
          />
          <DescItem label="Amount" value={transaction.amount ? 'RM' + transaction.amount : '-'} />
          <DescItem
            label="Wallet Balance"
            value={
              (transactionDetails &&
                (transactionDetails?.walletBalance || transactionDetails?.walletBalance === 0
                  ? 'RM' + transactionDetails?.walletBalance
                  : '-')) || <Skeleton />
            }
          />
          <DescItem label="Error Message" value={transactionDetails?.error?.description} />
          <DescItem label="Message" value={transactionDetails?.message} />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
};
