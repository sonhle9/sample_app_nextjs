import {
  getPaymentAcceptance,
  IPaymentMethod,
  PassThroughCardBrand,
  PaymentMethodFamily,
  PaymentMethodTypeId,
  SetelPaymentMethodType,
  WalletBrand,
} from '@setel/payment-interfaces';
import {
  Badge,
  BadgeProps,
  Card,
  CardHeading,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  formatDate,
  formatMoney,
  PaginationNavigation,
} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import React, {useState} from 'react';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {indexCheckoutTransactions} from 'src/react/services/api-checkout.service';
import {CheckoutTransactionStatus} from 'src/react/services/api-checkout.type';

type IDateRange = [string, string];

export default function CustomerCheckoutTransactions({userId}: {userId: string}) {
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination: {page, perPage, setPage, setPerPage},
  } = useDataTableState({
    initialFilter: {
      userId,
      paymentStatus: '',
      date: '',
      paymentMethod: '',
      dateRange: ['', ''] as IDateRange,
      keyword: '',
    },
    queryKey: 'indexCheckoutTransactions',
    queryFn: (data) => {
      const acceptanceMethod =
        PAYMENT_METHOD_OPTIONS.find((p) => p.value === data.paymentMethod) ||
        PAYMENT_METHOD_OPTIONS[0];
      const params = {
        ...data,
        paymentMethodFamily: acceptanceMethod.paymentMethodFamily,
        paymentMethodType: acceptanceMethod.paymentMethodType,
        paymentMethodBrand: acceptanceMethod.paymentMethodBrand,
      };
      return indexCheckoutTransactions(params);
    },
    components: [
      {
        key: 'paymentStatus',
        type: 'select',
        props: {
          label: 'Payment Status',
          options: CHECKOUT_PAYMENT_STATUS_OPTIONS,
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created Date',
        },
      },
      {
        key: 'paymentMethod',
        type: 'select',
        props: {
          label: 'Payment Method',
          options: PAYMENT_METHOD_OPTIONS,
        },
      },
      {
        key: 'keyword',
        type: 'search',
        props: {
          label: ' Transaction ID, Order Id, Merchant name, Sub Merchant Name',
          wrapperClass: 'md:col-span-full 2xl:col-span-3',
        },
      },
    ],
    enabled: isCardExpanded,
    retry: (retryCount, err: AxiosError) => {
      return err?.response?.status !== 404 && retryCount < 3;
    },
  });

  const getPaymentMethodLabel = (paymentMethod) => {
    const paymentMethodTypeId = (getPaymentAcceptance(paymentMethod) as IPaymentMethod)
      ?.paymentMethodTypeId;
    return paymentMethodTypeId
      ? PAYMENT_METHOD_OPTIONS.find((method) => method.value === paymentMethodTypeId)?.label
      : undefined;
  };

  return (
    <Card
      data-testid="financial-checkout-transactions-card"
      expandable
      isOpen={isCardExpanded}
      onToggleOpen={() => setIsCardExpanded((toggle) => !toggle)}
      className="mb-8">
      <CardHeading title="Checkout Transactions" data-testid="checkout-card-heading" />

      <Table
        type="primary"
        data-testid="financial-checkout-data-table"
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={
          data?.items &&
          perPage > 0 &&
          page > 0 && (
            <PaginationNavigation
              data-testid="checkout-pagination"
              variant="prev-next"
              onChangePage={setPage}
              onChangePageSize={setPerPage}
              currentPage={page}
              perPage={perPage}
              hideIfSinglePage={false}
            />
          )
        }>
        <Table.Thead>
          <Tr>
            <Td>TRANSACTION ID</Td>
            <Td>STATUS</Td>
            <Td>MERCHANT</Td>
            <Td>PAYMENT METHOD</Td>
            <Td>AMOUNT</Td>
            <Td>CREATED ON</Td>
            <Td>ERROR</Td>
          </Tr>
        </Table.Thead>

        {userId && data?.items.length > 0 ? (
          <Table.Tbody>
            {data?.items?.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>
                  <Link className="inline" to={`/checkout/sessions/${transaction.id}`}>
                    {transaction.id ?? '-'}
                  </Link>
                </Td>
                <Td>
                  <Badge
                    rounded="rounded"
                    className="uppercase"
                    color={transactionStatusColorMap[transaction.status] || 'grey'}>
                    {transaction.status ?? '-'}
                  </Badge>
                </Td>
                <Td>{transaction.merchantName ?? '-'}</Td>
                <Td>{getPaymentMethodLabel(transaction.paymentMethod) ?? '-'}</Td>
                <Td>{formatMoney(transaction.amount, {currency: transaction.currency}) ?? '-'}</Td>
                <Td>{(transaction?.createdAt && formatDate(transaction.createdAt)) ?? '-'}</Td>
                <Td>{(transaction?.error?.message && transaction.error?.message) ?? '-'}</Td>
              </Tr>
            ))}
          </Table.Tbody>
        ) : (
          <EmptyDataTableCaption />
        )}
      </Table>
    </Card>
  );
}

export const CHECKOUT_PAYMENT_STATUS_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Requires Payment Method',
    value: CheckoutTransactionStatus.requiresPaymentMethod,
  },
  {
    label: 'Processing',
    value: CheckoutTransactionStatus.processing,
  },
  {
    label: 'Pending',
    value: CheckoutTransactionStatus.pending,
  },
  {
    label: 'Succeeded',
    value: CheckoutTransactionStatus.succeeded,
  },
  {
    label: 'Failed',
    value: CheckoutTransactionStatus.failed,
  },
  {
    label: 'Cancelled',
    value: CheckoutTransactionStatus.cancelled,
  },
  {
    label: 'Authorised',
    value: CheckoutTransactionStatus.authorised,
  },

  {
    label: 'Partially Refunded',
    value: CheckoutTransactionStatus.partiallyRefunded,
  },
  {
    label: 'Refunded',
    value: CheckoutTransactionStatus.refunded,
  },
  {
    label: 'Expired',
    value: CheckoutTransactionStatus.expired,
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: 'All',
    value: '',
    paymentMethodFamily: '',
    paymentMethodType: '',
    paymentMethodBrand: '',
  },
  {
    label: 'Setel Wallet',
    value: PaymentMethodTypeId.WALLET_SETEL,
    paymentMethodFamily: PaymentMethodFamily.WALLET,
    paymentMethodType: SetelPaymentMethodType.SETEL,
    paymentMethodBrand: WalletBrand.SETEL,
  },
  {
    label: 'VISA',
    value: PaymentMethodTypeId.CARD_VISA,
    paymentMethodFamily: PaymentMethodFamily.WALLET,
    paymentMethodType: SetelPaymentMethodType.SETEL,
    paymentMethodBrand: PassThroughCardBrand.VISA,
  },
  {
    label: 'MasterCard',
    value: PaymentMethodTypeId.CARD_MASTERCARD,
    paymentMethodFamily: PaymentMethodFamily.WALLET,
    paymentMethodType: SetelPaymentMethodType.SETEL,
    paymentMethodBrand: PassThroughCardBrand.MASTER_CARD,
  },
];

const transactionStatusColorMap: Record<string, BadgeProps['color']> = {
  [CheckoutTransactionStatus.succeeded]: 'success',
  [CheckoutTransactionStatus.failed]: 'error',
  [CheckoutTransactionStatus.expired]: 'warning',
};
