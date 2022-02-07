import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Row,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  Button,
  formatMoney,
  FilterControls,
  FieldContainer,
  SearchTextInput,
  DownloadIcon,
  DataTableCaption,
} from '@setel/portal-ui';
import React, {useEffect} from 'react';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {filterEmptyString} from 'src/react/lib/ajax';
import {Link} from '../../../../react/routing/link';
import {billingStatementSummaryRoles} from 'src/shared/helpers/roles.type';
import {PageContainer} from '../../../components/page-container';
import {HasPermission} from '../../auth/HasPermission';
import {StatementStatus} from '../billing-statement-summary.constants';
import {useBillingStatementSummary} from '../billing-statement-summary.queries';
import {
  IStatementSummaryFilter,
  SmartpayAccountFleetPlans,
} from '../billing-statement-summary.types';
import moment from 'moment';
import {showAmountStatement} from 'src/app/billing-summary/shared/common';

function StatementSummaryFilter(props: {
  onSearch: (values: IStatementSummaryFilter) => void;
  currentFilters?: IStatementSummaryFilter;
}) {
  const [merchantId, setMerchantId] = React.useState('');
  console.log(merchantId);

  useEffect(() => {
    props.onSearch({merchantId});
  }, [merchantId]);

  return (
    <>
      <div className="mb-8">
        <FilterControls className="grid gap-4 lg:grid-cols-4">
          <FieldContainer label="SmartPay account ID" className="col-span-2">
            <SearchTextInput
              value={merchantId}
              onChangeValue={setMerchantId}
              placeholder="Enter SmartPay account ID"
            />
          </FieldContainer>
        </FilterControls>
      </div>
    </>
  );
}

export const PaginatedStatementSummary = (props: {
  filters: IStatementSummaryFilter;
  pagination: ReturnType<typeof usePaginationState>;
}) => {
  const {data, isLoading, isError, error} = useBillingStatementSummary({
    page: props.pagination.page,
    perPage: props.pagination.perPage,
    ...filterEmptyString(props.filters),
  });
  const isEmptyBillingStatementSummaryList =
    !isLoading && data?.billingStatementSummary?.length === 0;
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
              <Td className="w-1/5">STATEMENT DATE</Td>
              <Td className="w-1/5 text-right">CLOSING BALANCE (RM)</Td>
              <Td className="w-1/5 text-right">TOTAL CREDIT (RM)</Td>
              <Td className="w-1/5 text-right">TOTAL DEBIT (RM)</Td>
              <Td className="w-1/5 text-right">OVERDUE AGE</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryList &&
              data?.billingStatementSummary?.map((statementSummary) => {
                return (
                  <Tr
                    key={statementSummary.id}
                    render={(props) => (
                      <Link {...props} to={`/billing/statement-summary/${statementSummary.id}`} />
                    )}>
                    <Td className="w-1/5">
                      <div>
                        {statementSummary?.statementNo +
                          (statementSummary?.merchantId || statementSummary?.smartpayAccountId)}
                      </div>
                      <div className="text-lightgrey text-xs">
                        {formatDate(
                          new Date(statementSummary.statementDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        )}
                      </div>
                    </Td>
                    <Td className="w-1/5 text-right">
                      {showAmountStatement(statementSummary?.closingBalance)}
                    </Td>
                    <Td className="w-1/5 text-right">
                      {formatMoney(Math.abs(statementSummary?.totalCredit) || 0)}
                    </Td>
                    <Td className="w-1/5 text-right">
                      {formatMoney(Math.abs(statementSummary?.totalDebit) || 0)}
                    </Td>
                    <Td className="w-1/5 text-right">
                      {statementSummary?.status !== StatementStatus.PAID &&
                      statementSummary.smartpayAccountFleetPlan ===
                        SmartpayAccountFleetPlans.POSTPAID
                        ? moment() > moment(statementSummary.gracePaymentDueDate)
                          ? moment().diff(
                              moment(statementSummary?.gracePaymentDueDate).add(1, 'day'),
                              'month',
                            ) + 1
                          : 0
                        : 0}
                    </Td>
                  </Tr>
                );
              })}
          </Row>
          {isEmptyBillingStatementSummaryList && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-12 text-sm">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </Table>
      )}
    </>
  );
};

export const BillingStatementSummaryListing = () => {
  const [filters, setFilters] = React.useState<IStatementSummaryFilter>({});
  const paginationState = usePaginationState();

  const onSearch = (newFilters: IStatementSummaryFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };
  return (
    <>
      <PageContainer
        heading="Statement summary"
        action={
          <Button disabled={false} leftIcon={<DownloadIcon />} variant="outline">
            DOWNLOAD PDF
          </Button>
        }>
        <HasPermission accessWith={[billingStatementSummaryRoles.view]}>
          <StatementSummaryFilter onSearch={onSearch} currentFilters={filters} />
          <PaginatedStatementSummary filters={filters} pagination={paginationState} />
        </HasPermission>
      </PageContainer>
    </>
  );
};
