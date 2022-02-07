import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Row,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  FilterControls,
  FieldContainer,
  SearchTextInput,
  DateRangeDropdown,
  DataTableCaption,
} from '@setel/portal-ui';
import {DateRangeValue} from '@setel/portal-ui/dist/components/helper';
import React, {useEffect, useState} from 'react';
import {
  formatStatementTransactionDate,
  showAmountStatement,
} from '../../../../app/billing-summary/shared/common';
import {QueryErrorAlert} from '../../../../react/components/query-error-alert';
import {filterEmptyString} from '../../../../react/lib/ajax';
import {billingStatementSummaryRoles} from '../../../../shared/helpers/roles.type';
import {PageContainer} from '../../../components/page-container';
import {HasPermission} from '../../auth/HasPermission';
import {
  mappingTransactionDesc,
  SubSummaryTypes,
  SummaryTypes,
  TitleStatementTransaction,
} from '../billing-statement-summary.constants';
import {useBillingStatementSummaryTransactions} from '../billing-statement-summary.queries';
import {
  IStatementSummaryTransactionFilter,
  IStatementTransaction,
} from '../billing-statement-summary.types';
import {KnockOffList} from './knock-off-list-modal';

function StatementSummaryTransactionsFilter(props: {
  onSearch: (values: IStatementSummaryTransactionFilter) => void;
  currentFilters?: IStatementSummaryTransactionFilter;
}) {
  const [transactionDate, setTransactionDate] = React.useState<DateRangeValue>(['', '']);

  const [cardNo, setCardNo] = React.useState('');

  useEffect(() => {
    props.currentFilters.timeFrom = transactionDate[0];
    props.currentFilters.timeTo = transactionDate[1];
    props.currentFilters.cardNo = cardNo;
    props.onSearch({
      cardNo,
      ...props.currentFilters,
    });
  }, [cardNo, transactionDate]);

  return (
    <>
      <div className="mb-8">
        <FilterControls className="grid gap-4 lg:grid-cols-4">
          <FieldContainer label="Transaction date" className="col-span-2">
            <DateRangeDropdown
              value={transactionDate}
              onChangeValue={setTransactionDate}
              disableFuture
            />
          </FieldContainer>
          {props.currentFilters.subType === SubSummaryTypes.PURCHASE_CURRENT ? (
            <>
              <FieldContainer label="Card number" className="col-span-2">
                <SearchTextInput
                  value={cardNo}
                  onChangeValue={setCardNo}
                  placeholder="Enter card number..."
                />
              </FieldContainer>
            </>
          ) : (
            ''
          )}
        </FilterControls>
      </div>
    </>
  );
}

export const PaginatedStatementSummaryTransaction = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td className="min-w-60">TRANSACTION DATE</Td>
              <Td className="min-w-60">POSTING DATE</Td>
              <Td className="min-w-60">CARD NO.</Td>
              <Td className="min-w-60">DRIVER CARD NO.</Td>
              <Td className="min-w-60">MERCHANT ID</Td>
              <Td className="min-w-60">MERCHANT NAME</Td>
              <Td className="min-w-60">TRADING NAME</Td>
              <Td className="min-w-60 text-right">TRANS.AMOUNT (RM)</Td>
              <Td className="min-w-60 text-right">RRN</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr key={transaction.id}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{transaction?.cardNumber || '-'}</Td>
                      <Td>{transaction?.driverNo || '-'}</Td>
                      <Td>{transaction?.merchantId || '-'}</Td>
                      <Td>{transaction?.merchantName || '-'}</Td>
                      <Td>{transaction?.companyName || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || '-'}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
            <DataTableCaption>
              <div className="w-full flex flex-1 items-center justify-center py-12 text-sm">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </Table>
      )}
    </>
  );
};

export const PaginatedStatementSummaryTransactionPaymentThrough = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;
  const [isOpenKnockOffList, setOpenKnockOffList] = useState(false);
  const [refStatements, setRefStatements] = useState([]);
  const smartpayAccountId = data?.billingStatementSummaryTransactions[0]?.smartpayAccountId || '';

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANS. DATE</Td>
              <Td className="text-right">POSTING DATE</Td>
              <Td>TRANS. DESCRIPTION</Td>
              <Td className="text-right">TRANS. AMOUNT (RM)</Td>
              <Td className="text-right">REFERENCE NO.</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr
                      key={transaction.id}
                      onClick={() => {
                        setOpenKnockOffList(true), setRefStatements(transaction?.refStatements);
                      }}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td className="text-right">
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || '-'}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-12 text-sm">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </Table>
      )}
      {isOpenKnockOffList && (
        <KnockOffList
          smartpayAccountId={smartpayAccountId}
          refStatements={refStatements}
          onClose={() => setOpenKnockOffList(false)}
        />
      )}
    </>
  );
};

export const PaginatedStatementSummaryTransactionPaymentCashPaymentCheque = (props: {
  dataList: any;
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;
  const [isOpenKnockOffList, setOpenKnockOffList] = useState(false);
  const [refStatements, setRefStatements] = useState([]);
  const smartpayAccountId = data?.billingStatementSummaryTransactions[0]?.smartpayAccountId || '';

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
              <Td className="text-right">REFERENCE NO.</Td>
              <Td className="text-right">BATCH NO.</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr
                      key={transaction.id}
                      onClick={() => {
                        setOpenKnockOffList(true), setRefStatements(transaction.refStatements);
                      }}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || '-'}</Td>
                      <Td className="text-right">108020730052</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-12 text-sm">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </Table>
      )}
      {isOpenKnockOffList && (
        <KnockOffList
          smartpayAccountId={smartpayAccountId}
          refStatements={refStatements}
          onClose={() => setOpenKnockOffList(false)}
        />
      )}
    </>
  );
};

export const PaginatedStatementSummaryTransactionCollectionService = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;
  const [isOpenKnockOffList, setOpenKnockOffList] = useState(false);
  const [refStatements, setRefStatements] = useState([]);
  const smartpayAccountId = data?.billingStatementSummaryTransactions[0]?.smartpayAccountId || '';

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
              <Td className="text-right">REFERENCE NO.</Td>
              <Td className="text-right">COLLECTION BANK</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr
                      key={transaction.id}
                      onClick={() => {
                        setOpenKnockOffList(true), setRefStatements(transaction.refStatements);
                      }}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || '-'}</Td>
                      <Td className="text-right">{transaction?.collectionBank}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-12 text-sm">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </Table>
      )}
      {isOpenKnockOffList && (
        <KnockOffList
          smartpayAccountId={smartpayAccountId}
          refStatements={refStatements}
          onClose={() => setOpenKnockOffList(false)}
        />
      )}
    </>
  );
};

export const BillingStatementVolumeRebate = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr key={transaction.id}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
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

export const BillingStatementSummaryFees = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr key={transaction.id}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
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

export const BillingStatementCreditAdjustmentTransaction = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
              <Td className="text-right">REFERENCE NO.</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr key={transaction.id}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || ''}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
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

export const BillingStatementDebitAdjustmentTransaction = (props: {dataList: any}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  } = props.dataList;

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
              currentPage={paginationState.page}
              perPage={paginationState.perPage}
              onChangePage={paginationState.setPage}
              onChangePageSize={paginationState.setPerPage}
            />
          }>
          <Row groupType="thead">
            <Tr>
              <Td>TRANSACTION DATE</Td>
              <Td>POSTING DATE</Td>
              <Td>TRANSACTION DESCRIPTION</Td>
              <Td className="text-right">TRANSACTION AMOUNT (RM)</Td>
              <Td className="text-right">REFERENCE NO.</Td>
            </Tr>
          </Row>
          <Row>
            {!isEmptyBillingStatementSummaryTransactionsList &&
              data?.billingStatementSummaryTransactions?.map(
                (transaction: IStatementTransaction) => {
                  return (
                    <Tr key={transaction.id}>
                      <Td>{formatStatementTransactionDate(transaction.transactionDate)}</Td>
                      <Td>
                        {formatDate(
                          new Date(transaction?.postingDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {formatType: 'dateOnly'},
                        ) || '-'}
                      </Td>
                      <Td>{mappingTransactionDesc[transaction?.subType] || '-'}</Td>
                      <Td className="text-right">{showAmountStatement(transaction?.amount)}</Td>
                      <Td className="text-right">{transaction?.rrn || ''}</Td>
                    </Tr>
                  );
                },
              )}
          </Row>
          {isEmptyBillingStatementSummaryTransactionsList && (
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

export const BillingStatementSummaryTransactions = ({
  billingStatementSummaryId,
  type,
  subType,
  isPrevCycle,
}) => {
  const [filters, setFilters] = React.useState<IStatementSummaryTransactionFilter>({
    id: billingStatementSummaryId,
    type: type,
    subType: subType,
    isPrevCycle,
  });
  const paginationState = usePaginationState();

  const onSearch = (newFilters: IStatementSummaryTransactionFilter) => {
    setFilters(newFilters);
    paginationState.setPage(1);
  };

  const heading = TitleStatementTransaction[subType];

  const {data, isLoading, isError, error} = useBillingStatementSummaryTransactions({
    page: paginationState.page,
    perPage: paginationState.perPage,
    ...filterEmptyString(filters),
  });

  const isEmptyBillingStatementSummaryTransactionsList =
    !isLoading && data?.billingStatementSummaryTransactions?.length === 0;

  const dataList = {
    data,
    isLoading,
    isError,
    error,
    isEmptyBillingStatementSummaryTransactionsList,
    paginationState,
  };

  return (
    <>
      <PageContainer heading={heading}>
        <HasPermission accessWith={[billingStatementSummaryRoles.view]}>
          {[SummaryTypes.PAYMENT, SummaryTypes.PURCHASE].includes(filters.type) ? (
            <>
              <StatementSummaryTransactionsFilter onSearch={onSearch} currentFilters={filters} />
              {[SubSummaryTypes.PAYMENT_CHEQUE, SubSummaryTypes.PAYMENT_CASH].includes(
                filters.subType,
              ) ? (
                <PaginatedStatementSummaryTransactionPaymentCashPaymentCheque dataList={dataList} />
              ) : [SubSummaryTypes.PAYMENT_VIRTUAL_ACCOUNT].includes(filters.subType) ? (
                <PaginatedStatementSummaryTransactionPaymentThrough dataList={dataList} />
              ) : [
                  SubSummaryTypes.PAYMENT_CASH_SERVICE,
                  SubSummaryTypes.PAYMENT_CHEQUE_SERVICE,
                ].includes(filters.subType) ? (
                <PaginatedStatementSummaryTransactionCollectionService dataList={dataList} />
              ) : (
                <PaginatedStatementSummaryTransaction dataList={dataList} />
              )}
            </>
          ) : [SummaryTypes.ADJUSTMENT].includes(filters.type) ? (
            <>
              {[SubSummaryTypes.ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT].includes(filters.subType) ? (
                <PaginatedStatementSummaryTransaction dataList={dataList} />
              ) : [SubSummaryTypes.ADJUSTMENT_CREDIT].includes(filters.subType) ? (
                <BillingStatementCreditAdjustmentTransaction dataList={dataList} />
              ) : [SubSummaryTypes.ADJUSTMENT_DEBIT].includes(filters.subType) ? (
                <BillingStatementDebitAdjustmentTransaction dataList={dataList} />
              ) : (
                <>
                  <StatementSummaryTransactionsFilter
                    onSearch={onSearch}
                    currentFilters={filters}
                  />
                  <BillingStatementVolumeRebate dataList={dataList} />
                </>
              )}
            </>
          ) : (
            <BillingStatementSummaryFees dataList={dataList} />
          )}
        </HasPermission>
      </PageContainer>
    </>
  );
};
