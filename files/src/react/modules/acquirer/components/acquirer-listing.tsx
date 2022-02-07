import {
  Button,
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  Modal,
  PaginationNavigation,
  PlusIcon,
  titleCase,
  useDebounce,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {filterEmptyString} from 'src/react/lib/ajax';
import {useMerchantSearch} from 'src/react/modules/merchants';
import {Link} from 'src/react/routing/link';
import {
  AcquirersStatus,
  AcquirersType,
  listAcquirers,
  ListAcquirersParams,
} from 'src/react/services/api-switch.service';
import {PaymentProcessorName, paymentProcessorOptions} from '../acquirer.const';
import {acquirerQueryKey} from '../acquirer.queries';
import {AcquirerForm} from './acquirer-form';

export const AcquirerListing = () => {
  const [merchantSearchText, setMerchantSearchText] = React.useState('');
  const usedMerchantSearchText = useDebounce(merchantSearchText);

  const {data: merchantSearchResult} = useMerchantSearch(
    {
      name: usedMerchantSearchText,
    },
    {
      select: (result) =>
        result.items.map((merchant) => ({
          label: merchant.name,
          value: merchant.merchantId,
        })),
    },
  );

  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      paymentProcessor: '',
      type: '',
      status: '',
      combinedName: '',
      merchantId: '',
    } as FilterValues,
    queryKey: acquirerQueryKey.indexAcquirers,
    queryFn: (data) => listAcquirers(mapFilter(data)),
    onChange: (filter) => {
      if (!filter.merchantId && merchantSearchText) {
        setMerchantSearchText('');
      }
    },
    components: [
      {
        key: 'paymentProcessor',
        type: 'select',
        props: {
          label: 'Payment Processor',
          options: paymentProcessorOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'type',
        type: 'select',
        props: {
          label: 'Type',
          options: typeOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: statusOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'merchantId',
        type: 'searchableselect',
        props: {
          label: 'Merchant',
          options: merchantSearchText === usedMerchantSearchText ? merchantSearchResult : undefined,
          onInputValueChange: setMerchantSearchText,
        },
      },
      {
        key: 'combinedName',
        type: 'search',
        props: {
          label: 'Destination',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const dismissCreateModal = () => setShowCreateModal(false);

  return (
    <PageContainer
      heading="Acquirers"
      action={
        <Button leftIcon={<PlusIcon />} variant="primary" onClick={() => setShowCreateModal(true)}>
          CREATE
        </Button>
      }>
      <Modal isOpen={showCreateModal} onDismiss={dismissCreateModal} header="Create Acquirer">
        <AcquirerForm onDismiss={dismissCreateModal} />
      </Modal>
      <div className="space-y-5">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.total}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Payment Processor</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((acquirer) => (
                <Table.Tr
                  render={(rowProps) => (
                    <Link {...rowProps} to={`/gateway/acquirers/details/${acquirer.id}`} />
                  )}
                  key={acquirer.id}>
                  <Table.Td>{acquirer.name}</Table.Td>
                  <Table.Td>
                    {acquirer.paymentProcessor && PaymentProcessorName[acquirer.paymentProcessor]}
                  </Table.Td>
                  <Table.Td>{titleCase(acquirer.type)}</Table.Td>
                  <Table.Td>{titleCase(acquirer.status)}</Table.Td>
                  <Table.Td>{formatDate(acquirer.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.isEmpty && (
            <Table.Caption>
              <div className="p-6 text-center">
                <p>No data to be displayed.</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FilterValues {
  paymentProcessor: string;
  type: string;
  status: string;
  combinedName: string;
  merchantId: string;
}

const mapFilter = (values: FilterValues): ListAcquirersParams => filterEmptyString(values);

const typeOptions = Object.values(AcquirersType).map((value) => ({
  value,
  label: titleCase(value),
}));

const statusOptions = Object.values(AcquirersStatus).map((value) => ({
  value,
  label: titleCase(value),
}));
