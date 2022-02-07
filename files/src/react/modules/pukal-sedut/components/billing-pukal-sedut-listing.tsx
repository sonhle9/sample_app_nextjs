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
  Button,
  PlusIcon,
} from '@setel/portal-ui';
import {HasPermission} from '../../auth/HasPermission';
import {billingPukalPaymentRole} from '../../../../shared/helpers/roles.type';
import {useEffect} from 'react';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {
  DataTable as Table,
  DataTableRowGroup as Row,
  DataTableRow as Tr,
  DataTableCell as Td,
} from '@setel/portal-ui';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {getInvoiceStatusColor} from '../../billing-invoices/billing-invoices.types';
import {mappingInvoiceStatus} from '../../billing-invoices/billing-invoices.constants';
import {useMalaysiaTime} from '../../billing-subscriptions/billing-subscriptions.helpers';
import {PUKAL_STATUS, PUKAL_TYPE} from '../../pukal-payment/billing-pukal-payment.constants';
import {BillingPukalPaymentModal} from '../../pukal-payment/components/billing-pukal-payment-modal';
import {convertAppliedArray2Objects, IPukalSedutFilter} from '../billing-pukal-sedut.types';

function PukalSedutFilter(props: {
  onSearch: (values: IPukalSedutFilter) => void;
  currentFilters?: IPukalSedutFilter;
}) {
  const filter = useFilter(
    {
      searchSPA: '',
      status: undefined,
      type: '',
      code: undefined,
    },
    {
      baseValues: {
        searchSPA: '',
        status: '',
      },
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            options: PUKAL_STATUS,
            label: 'Status',
            wrapperClass: 'col-span-1',
            placeholder: 'Any Statuses',
          },
        },
        {
          key: 'type',
          type: 'select',
          props: {
            options: Object.values(PUKAL_TYPE),
            label: 'Pukal type',
            wrapperClass: 'col-span-1',
            placeholder: 'Any types',
          },
        },
        {
          key: 'code',
          type: 'select',
          props: {
            options: [],
            disabled: true,
            label: 'Pukal code',
            wrapperClass: 'col-span-2 bg-neutral-300',
            placeholder: 'Any codes',
          },
        },
        {
          key: 'searchSPA',
          type: 'search',
          props: {
            label: 'Search',
            wrapperClass: 'col-span-2',
            placeholder: 'Search by Pukal payment ID, cheque ID or slip number',
          },
        },
      ],
    },
  );

  const [{applied}, {reset}] = filter;

  useEffect(() => {
    const appliedObject = convertAppliedArray2Objects(applied);
    props.onSearch({status: appliedObject?.status, searchSPA: appliedObject?.searchSPA});
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

export const PaginatedPukalPayment = (props: {
  filters: IPukalSedutFilter;
  pagination: ReturnType<typeof usePaginationState>;
}) => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  let data = undefined;
  let isError = undefined;
  let error = undefined;
  let isLoading = undefined;
  // const {data, isLoading, isError, error} = useBillingInvoices({
  //   page: props.pagination.page,
  //   perPage: props.pagination.perPage,
  //   ...filterEmptyString(props.filters),
  // });

  const isEmptyPukalPaymentList = !isLoading && data?.billingInvoices?.length === 0;

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
              <Td className="w-2/12">Pukal code </Td>
              <Td className="w-2/12">Status</Td>
              <Td className="w-2/12 text-right">cheque amount (rm)</Td>
              <Td className="w-3/12 text-right">Statement date</Td>
              <Td className="w-3/12 text-right">approver</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyPukalPaymentList &&
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
          {isEmptyPukalPaymentList && (
            <EmptyDataTableCaption content="You have no data to be displayed here" />
          )}
        </Table>
      )}
    </>
  );
};

export const BillingPukalSedutListing = () => {
  const [filters, setFilters] = React.useState<IPukalSedutFilter>({});
  const paginationState = usePaginationState();
  const [showEditModal, setShowEditModal] = React.useState(false);

  const onSearch = (newFilters: IPukalSedutFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };

  return (
    <PageContainer
      heading={'Pukal Payment'}
      className={'space-y-4'}
      action={
        <HasPermission accessWith={[billingPukalPaymentRole.view]}>
          <Button
            variant="primary"
            leftIcon={<PlusIcon />}
            onClick={() => {
              setShowEditModal(true);
            }}
            data-testid="btn-create">
            CREATE
          </Button>
        </HasPermission>
      }>
      <BillingPukalPaymentModal
        id=""
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
      <HasPermission accessWith={[billingPukalPaymentRole.view]}>
        <PukalSedutFilter onSearch={onSearch} currentFilters={filters} />
        <PaginatedPukalPayment filters={filters} pagination={paginationState} />
      </HasPermission>
    </PageContainer>
  );
};
