import React from 'react';
import {
  Badge,
  Filter,
  FilterControls,
  useFilter,
  DataTable as Table,
  usePaginationState,
  PaginationNavigation,
  formatMoney,
  formatDate,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {PageContainer} from '../../../components/page-container';
import {EmptyDataTableCaption} from '../../../components/empty-data-table-caption';
import {
  creditNotesStatusOptions,
  CreditNotesTypeOptions,
  mappingBillingCreditNotesStatusColor,
  mappingBillingCreditNotesStatusName,
  mappingBillingCreditNotesTypeName,
} from '../billing-credit-notes.constants';
import {useBillingCreditNotes} from '../billing-credit-notes.queries';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {useMalaysiaTime} from '../../billing-invoices/billing-invoices.helpers';

export const BillingCreditNotesListing = () => {
  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const filter = useFilter(
    {
      searchCreditNote: '',
      status: undefined,
      type: undefined,
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            options: creditNotesStatusOptions,
            placeholder: 'Any status',
          },
        },
        {
          key: 'type',
          type: 'select',
          props: {
            label: 'Type',
            options: CreditNotesTypeOptions,
            placeholder: 'Any type',
          },
        },
        {
          key: 'searchCreditNote',
          type: 'search',
          props: {
            label: 'Search',
            placeholder: 'Search merchant name, credit note ID',
            wrapperClass: 'col-span-2',
          },
        },
      ],
    },
  );

  const [{values}] = filter;
  const {data, isFetching, isLoading, isError, error} = useBillingCreditNotes({
    ...values,
    page,
    perPage,
  });

  return (
    <PageContainer heading="Credit notes" className="space-y-4">
      {isError && <QueryErrorAlert error={error as any} />}
      <FilterControls className="lg:grid-cols-4" filter={filter} />
      <Filter filter={filter} />
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={
          <PaginationNavigation
            total={data?.total}
            currentPage={page}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
          />
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="text-right w-1/6">Amount (RM)</Table.Th>
            <Table.Th className="w-1/6">Status</Table.Th>
            <Table.Th className="w-1/6 text-right">Credit note ID</Table.Th>
            <Table.Th className="w-1/3">Merchant name</Table.Th>
            <Table.Th className="text-right w-1/6">Issued date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {data?.isEmpty || isError ? (
          <EmptyDataTableCaption />
        ) : (
          <Table.Tbody>
            {data?.billingCreditNotes.map((billingCreditNote) => (
              <Table.Tr
                key={billingCreditNote.id}
                render={(billingProps) => (
                  <a
                    target={'_blank'}
                    href={`${webDashboardUrl}/billing/credit-notes?merchantId=${billingCreditNote.merchantId}&id=${billingCreditNote.id}&redirect-from=admin`}
                    {...billingProps}
                  />
                )}
                className="cursor-pointer">
                <Table.Td className="text-right">
                  {formatMoney(billingCreditNote.totalAmount)}
                </Table.Td>
                <Table.Td>
                  <Badge color={mappingBillingCreditNotesStatusColor[billingCreditNote.status]}>
                    {billingCreditNote?.status &&
                      mappingBillingCreditNotesStatusName[billingCreditNote.status]}
                  </Badge>
                </Table.Td>
                <Table.Td className="text-right">{billingCreditNote.creditNoteID}</Table.Td>
                <Table.Td>
                  <span>{billingCreditNote.attributes.merchantName}</span>
                  <span className="block mt-2 text-xs font-normal text-lightgrey">
                    {mappingBillingCreditNotesTypeName[billingCreditNote.type]}
                  </span>
                </Table.Td>
                <Table.Td className="text-right w-1/6">
                  {billingCreditNote?.issuedDate &&
                    formatDate(useMalaysiaTime(billingCreditNote.issuedDate), {
                      formatType: 'dateOnly',
                    })}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        )}
      </Table>
    </PageContainer>
  );
};
