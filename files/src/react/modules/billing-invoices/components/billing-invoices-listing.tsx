import * as React from 'react';
import {PageContainer} from '../../../components/page-container';
import {
  usePaginationState,
  PaginationNavigation,
  Filter,
  Badge,
  formatDate,
  FilterControls,
  useFilter,
  formatMoney,
} from '@setel/portal-ui';
import {HasPermission} from '../../auth/HasPermission';
import {billingInvoicesRole} from '../../../../shared/helpers/roles.type';
import {
  getInvoiceStatusColor,
  IInvoiceFilter,
  InvoicesStatusOptions,
  convertAppliedArray2Objects,
} from '../billing-invoices.types';
import {mappingInvoiceStatus} from '../billing-invoices.constants';
import {useMalaysiaTime} from '../billing-invoices.helpers';
import {useBillingInvoices} from '../billing-invoices.queries';
import {useEffect} from 'react';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {
  DataTable as Table,
  DataTableRowGroup as Row,
  DataTableRow as Tr,
  DataTableCell as Td,
} from '@setel/portal-ui';
import {filterEmptyString} from 'src/react/lib/ajax';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';

function InvoiceFilter(props: {
  onSearch: (values: IInvoiceFilter) => void;
  currentFilters?: IInvoiceFilter;
}) {
  const filter = useFilter(
    {
      searchInvoice: '',
      status: undefined,
    },
    {
      baseValues: {
        searchInvoice: '',
        status: '',
      },
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            options: InvoicesStatusOptions,
            placeholder: 'Any status',
          },
        },
        {
          key: 'searchInvoice',
          type: 'search',
          props: {
            label: 'Search',
            wrapperClass: 'col-span-2',
            placeholder: 'Search merchant name, invoice ID',
          },
        },
      ],
    },
  );

  const [{applied}, {reset}] = filter;

  useEffect(() => {
    const appliedObject = convertAppliedArray2Objects(applied);
    props.onSearch({status: appliedObject?.status, searchInvoice: appliedObject?.searchInvoice});
  }, [applied[0]?.value, applied[1]?.value]);

  return (
    <>
      <FilterControls className="mb-2 lg:grid-cols-4" filter={filter} />
      {applied.length > 0 && (
        <Filter className="px-3" onReset={reset}>
          {applied.map((item) => (
            <Badge onDismiss={item.resetValue} key={item.prop}>
              {item.label}
            </Badge>
          ))}
        </Filter>
      )}
    </>
  );
}

export const PaginatedInvoices = (props: {
  filters: IInvoiceFilter;
  pagination: ReturnType<typeof usePaginationState>;
}) => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

  const {data, isLoading, isError, error} = useBillingInvoices({
    page: props.pagination.page,
    perPage: props.pagination.perPage,
    ...filterEmptyString(props.filters),
  });

  const isEmptyBillingInvoiceList = !isLoading && data?.billingInvoices?.length === 0;

  return (
    <>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <Table
          isLoading={isLoading}
          striped
          pagination={
            <PaginationNavigation
              total={data?.total}
              currentPage={props.pagination.page}
              perPage={props.pagination.perPage}
              onChangePage={props.pagination.setPage}
              onChangePageSize={props.pagination.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td className="w-2/12 text-right">Amount (RM)</Td>
              <Td className="w-2/12">Status</Td>
              <Td className="w-2/12 text-right">Invoice ID</Td>
              <Td className="w-3/12">Merchant name</Td>
              <Td className="w-3/12 text-right">Invoice date</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingInvoiceList &&
              data?.billingInvoices?.map((billingInvoice) => (
                <Tr
                  key={billingInvoice.id}
                  render={(billingProps) => (
                    <a
                      target={'_blank'}
                      href={`${webDashboardUrl}/billing/invoices?merchantId=${billingInvoice.merchantId}&id=${billingInvoice.id}&redirect-from=admin`}
                      {...billingProps}
                    />
                  )}>
                  <Td className="text-right">{formatMoney(billingInvoice.totalAmount)}</Td>
                  <Td>
                    <Badge
                      rounded="rounded"
                      color={getInvoiceStatusColor(billingInvoice.status)}
                      className="uppercase"
                      key={billingInvoice.status}>
                      {mappingInvoiceStatus[billingInvoice.status]}
                    </Badge>
                  </Td>
                  <Td className="text-right">{billingInvoice.invoiceID}</Td>
                  <Td>{billingInvoice.attributes?.merchantName}</Td>
                  <Td className="text-right">
                    {billingInvoice.invoiceDate
                      ? formatDate(useMalaysiaTime(billingInvoice.invoiceDate), {
                          formatType: 'dateOnly',
                        })
                      : '-'}
                  </Td>
                </Tr>
              ))}
          </Row>
          {isEmptyBillingInvoiceList && (
            <EmptyDataTableCaption content="You have no data to be displayed here" />
          )}
        </Table>
      )}
    </>
  );
};

export const BillingInvoicesListing = () => {
  const [filters, setFilters] = React.useState<IInvoiceFilter>({});
  const paginationState = usePaginationState();

  const onSearch = (newFilters: IInvoiceFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };

  return (
    <PageContainer heading={'Invoices'} className={'space-y-4'}>
      <HasPermission accessWith={[billingInvoicesRole.view]}>
        <InvoiceFilter onSearch={onSearch} currentFilters={filters} />
        <PaginatedInvoices filters={filters} pagination={paginationState} />
      </HasPermission>
    </PageContainer>
  );
};
