import {
  Alert,
  Badge,
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  Modal,
  ModalHeader,
  PaginationNavigation,
  PlusIcon,
  titleCase,
} from '@setel/portal-ui';
import React, {useLayoutEffect, useRef} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {getProcessorFees} from 'src/react/services/api-ledger.service';
import {convertToOptions} from '../fee-settings.const';
import {
  FeeSettingTransactionTypes,
  PaymentOptions,
  TransactionPGVendors,
} from '../fee-settings.enum';
import FeeSettingsForm from './fee-settings-form';

export const FeeSettingsListing = () => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const dismissAddForm = () => setShowAddForm(false);

  const {
    query: {data: data, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      paymentGatewayVendor: '',
      transactionType: '',
      paymentOption: '',
    },
    queryKey: 'processor-fee-settings-filter',
    queryFn: (currentValues) => getProcessorFees(currentValues),
    components: (val) => [
      {
        key: 'paymentGatewayVendor',
        type: 'select',
        props: {
          options: PAYMENT_PROCESSOR_OPTIONS,
          label: 'Payment processor',
        },
      },
      {
        key: 'transactionType',
        type: 'select',
        props: {
          label: 'Transaction type',
          options: FEE_SETTING_VENDOR_OPTIONS[val.paymentGatewayVendor || 'ALL'].transactionTypes,
        },
      },
      {
        key: 'paymentOption',
        type: 'select',
        props: {
          label: 'Payment option',
          options: FEE_SETTING_VENDOR_OPTIONS[val.paymentGatewayVendor || 'ALL'].paymentOptions,
        },
      },
    ],
  });

  const [{values, applied}, {reset, resetValue}] = filter;

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      resetValue('transactionType');
      resetValue('paymentOption');
    }
  }, [values.paymentGatewayVendor]);

  return (
    <PageContainer
      className="pt-7"
      heading="Payment processor fee"
      action={
        <Button variant="primary" onClick={() => setShowAddForm(true)} leftIcon={<PlusIcon />}>
          CREATE
        </Button>
      }>
      <Modal
        size="large"
        aria-label="Add new payment processor fee"
        isOpen={showAddForm}
        onDismiss={dismissAddForm}>
        <ModalHeader>Create new payment processor fee</ModalHeader>
        <FeeSettingsForm onCancel={dismissAddForm} onSuccess={dismissAddForm} />
      </Modal>
      <div className="mb-8 -mt-2">
        <FilterControls filter={filter} className="mb-8" />
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          pagination={
            <PaginationNavigation
              total={data?.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Rule ID</Td>
              <Td>Payment processor</Td>
              <Td>Transaction type</Td>
              <Td className="text-right">Payment option</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data &&
              data.items.map((fee) => (
                <Tr
                  key={fee.id}
                  render={(props) => (
                    <Link
                      to={`/fee-settings/${fee.id}`}
                      data-testid="fee-settings-record"
                      {...props}
                    />
                  )}>
                  <Td>{fee.id}</Td>
                  <Td>{titleCase(fee.paymentGatewayVendor, {hasUnderscore: true})}</Td>
                  <Td>{titleCase(fee.transactionType, {hasUnderscore: true})}</Td>
                  <Td className="text-right">
                    {titleCase(fee.paymentOption, {hasUnderscore: true})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const PAYMENT_PROCESSOR_OPTIONS = convertToOptions(TransactionPGVendors);

const FEE_SETTING_VENDOR_OPTIONS = {
  ALL: {
    transactionTypes: convertToOptions(FeeSettingTransactionTypes),
    paymentOptions: convertToOptions(PaymentOptions),
  },
  [TransactionPGVendors.IPAY88 as string]: {
    transactionTypes: convertToOptions({
      TOPUP: 'TOPUP',
      TOPUP_REFUND: 'TOPUP_REFUND',
      PASSTHROUGH_FUEL: 'PASSTHROUGH_FUEL',
      PASSTHROUGH_FUEL_REFUND: 'PASSTHROUGH_FUEL_REFUND',
      PASSTHROUGH_STORE: 'PASSTHROUGH_STORE',
      PASSTHROUGH_STORE_REFUND: 'PASSTHROUGH_STORE_REFUND',
    }),
    paymentOptions: convertToOptions({
      FPX: 'FPX',
      CREDIT_CARD: 'CREDIT_CARD',
      DEBIT_CARD: 'DEBIT_CARD',
    }),
  },
  [TransactionPGVendors.BOOST as string]: {
    transactionTypes: convertToOptions({
      CHARGE_BOOST: 'CHARGE_BOOST',
      REFUND_BOOST: 'REFUND_BOOST',
      TOPUP_BOOST: 'TOPUP_BOOST',
      TOPUP_REFUND_BOOST: 'TOPUP_REFUND_BOOST',
    }),
    paymentOptions: convertToOptions({
      BOOST: 'BOOST',
    }),
  },
  [TransactionPGVendors.TNG as string]: {
    transactionTypes: convertToOptions({
      CHARGE_TNG: 'CHARGE_TNG',
      REFUND_TNG: 'REFUND_TNG',
    }),
    paymentOptions: convertToOptions({
      TNG: 'TNG',
    }),
  },
};
