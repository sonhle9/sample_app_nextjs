import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Row,
  PaginationNavigation,
  usePaginationState,
  FilterControls,
  FieldContainer,
  SearchTextInput,
  DataTableCaption,
  Badge,
  DropdownSelect,
} from '@setel/portal-ui';
import React, {useEffect} from 'react';
import {showAmountStatement} from 'src/app/billing-summary/shared/common';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {filterEmptyString} from 'src/react/lib/ajax';
// import {Link} from '../../../../react/routing/link';
import {billingStatementSummaryRoles} from 'src/shared/helpers/roles.type';
import {PageContainer} from '../../../components/page-container';
import {HasPermission} from '../../auth/HasPermission';
import {BalanceStatusOptions, mappingBalanceStatus} from '../billing-statement-summary.constants';
import {useBillingStatementAccount} from '../billing-statement-summary.queries';
import {getBalanceStatusColor, IStatementAccountFilter} from '../billing-statement-summary.types';

function StatementSummaryFilter(props: {
  onSearch: (values: IStatementAccountFilter) => void;
  currentFilters?: IStatementAccountFilter;
}) {
  const [merchantId, setMerchantId] = React.useState('');
  const [balanceStatus, setBalanceStatus] = React.useState(null);

  useEffect(() => {
    props.onSearch({merchantId, balanceStatus});
  }, [merchantId, balanceStatus]);

  BalanceStatusOptions;

  return (
    <>
      <div className="mb-8">
        <FilterControls className="grid gap-4 lg:grid-cols-4">
          <FieldContainer label="Status">
            <DropdownSelect
              name="Status"
              value={balanceStatus}
              placeholder="All statuses"
              options={BalanceStatusOptions}
              onChangeValue={(value) => {
                setBalanceStatus(value);
              }}
            />
          </FieldContainer>
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
  filters: IStatementAccountFilter;
  pagination: ReturnType<typeof usePaginationState>;
}) => {
  const {data, isLoading, isError, error} = useBillingStatementAccount({
    page: props.pagination.page,
    perPage: props.pagination.perPage,
    ...filterEmptyString(props.filters),
  });
  const isEmptyBillingStatementSummaryList =
    !isLoading && data?.billingStatementAccount?.length === 0;
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
              <Td className="w-1/5">SMARTPAY ACCOUNT</Td>
              <Td className="w-1/5 text-right">ACCOUNT STATUS</Td>
              <Td className="w-1/5 text-right">OVERDUE BALANCE(RM)</Td>
              <Td className="w-1/5 text-right">OUTSTANDING BALANCE(RM)</Td>
              <Td className="w-1/5 text-right">SALES REGION</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryList &&
              data?.billingStatementAccount?.map((statementAccount) => {
                return (
                  <Tr
                    key={statementAccount.id}
                    // render={(props) => (
                    //   <Link {...props} to={`/billing/statement-summary/${statementSummary.id}`} />
                    // )}
                  >
                    <Td className="w-1/5">
                      <div>{statementAccount?.merchantName || ''}</div>
                      <div className="text-lightgrey text-xs">{statementAccount?.merchantId}</div>
                    </Td>
                    <Td className="w-1/5 text-right">
                      <Badge
                        rounded="rounded"
                        color={getBalanceStatusColor(statementAccount.balanceStatus)}
                        className="uppercase"
                        key={statementAccount.balanceStatus}>
                        {mappingBalanceStatus[statementAccount.balanceStatus]}
                      </Badge>
                    </Td>
                    <Td className="w-1/5 text-right">
                      {showAmountStatement(statementAccount?.overdueBalance)}
                    </Td>
                    <Td className="w-1/5 text-right">
                      {showAmountStatement(statementAccount?.closingBalance)}
                    </Td>
                    <Td className="w-1/5 text-right">{'SRW2'}</Td>
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

export const BillingStatementAccountListing = () => {
  const [filters, setFilters] = React.useState<IStatementAccountFilter>({});
  const paginationState = usePaginationState();

  const onSearch = (newFilters: IStatementAccountFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };
  return (
    <>
      <PageContainer heading="Account statement">
        <HasPermission accessWith={[billingStatementSummaryRoles.view]}>
          <StatementSummaryFilter onSearch={onSearch} currentFilters={filters} />
          <PaginatedStatementSummary filters={filters} pagination={paginationState} />
        </HasPermission>
      </PageContainer>
    </>
  );
};
