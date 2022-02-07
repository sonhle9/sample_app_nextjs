import {
  Badge,
  Card,
  CardHeading,
  DataTable as Table,
  DescList,
  ExternalIcon,
  formatDate,
  formatMoney,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  showAmountStatement,
  showAmountStatementWithRM,
} from 'src/app/billing-summary/shared/common';
import {PageContainer} from '../../../../react/components/page-container';
import {QueryErrorAlert} from '../../../../react/components/query-error-alert';
import {Link} from '../../../../react/routing/link';
import {
  mappingStatusColor,
  mappingStatusName,
  SubSummaryTypes,
  SubSummaryTypesTextPair,
  SummaryTypes,
  SummaryTypesTextPair,
} from '../billing-statement-summary.constants';
import {useBillingStatementSummaryDetail} from '../billing-statement-summary.queries';
import {
  IBillingStatementSummaryDetailsProps,
  SmartpayAccountFleetPlans,
} from '../billing-statement-summary.types';

export const BillingStatementSummaryDetail = ({
  billingStatementSummaryId,
}: IBillingStatementSummaryDetailsProps) => {
  const {
    data: statement,
    isLoading,
    isError,
    error,
  } = useBillingStatementSummaryDetail(billingStatementSummaryId);

  const classRowTotal = React.useMemo(() => {
    return statement?.summaries.length % 2 === 0
      ? 'bg-lightergrey hover:bg-gray-100'
      : 'bg-white hover:bg-gray-100';
  }, [statement?.summaries]);

  return (
    <PageContainer heading="Statement summary details">
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <>
          <Card className="mb-6">
            <Card.Heading title="General" />
            <Card.Content>
              <DescList isLoading={isLoading}>
                <DescList.Item
                  label="Statement status"
                  value={
                    <Badge color={mappingStatusColor[statement?.status]}>
                      {statement?.status && mappingStatusName[statement?.status]}
                    </Badge>
                  }
                />
                <DescList.Item
                  label="Statement date"
                  value={
                    statement?.statementEndDate &&
                    formatDate(
                      new Date(statement.statementEndDate).toLocaleString('en-US', {
                        timeZone: 'Asia/Kuala_Lumpur',
                      }),
                      {
                        formatType: 'dateOnly',
                      },
                    )
                  }
                />
                <DescList.Item
                  label="Statement no."
                  value={statement?.statementNo + statement?.smartpayAccountId || '-'}
                />
                {statement?.smartpayAccountFleetPlan === SmartpayAccountFleetPlans.POSTPAID && (
                  <>
                    <DescList.Item
                      label="Amount due"
                      value={showAmountStatementWithRM(statement?.closingBalance)}
                    />
                    <DescList.Item
                      label="Payment due date"
                      value={
                        (statement?.paymentDueDate &&
                          formatDate(
                            new Date(statement.paymentDueDate).toLocaleString('en-US', {
                              timeZone: 'Asia/Kuala_Lumpur',
                            }),
                            {
                              formatType: 'dateOnly',
                            },
                          )) ||
                        '-'
                      }
                    />
                  </>
                )}
                {statement?.smartpayAccountFleetPlan === SmartpayAccountFleetPlans.PREPAID && (
                  <DescList.Item
                    label="Account balance"
                    value={showAmountStatementWithRM(statement?.closingBalance)}
                  />
                )}
              </DescList>
            </Card.Content>
          </Card>
          <Card>
            <Table heading={<CardHeading title="Summary" />}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-2/4">DESCRIPTION</Table.Th>
                  <Table.Th className="w-1/4 text-right">AMOUNT (RM)</Table.Th>
                  <Table.Th className="w-1/4 text-right">TOTAL (RM)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Previous balance</Table.Td>
                  <Table.Td className="text-right"></Table.Td>
                  <Table.Td className="text-right">
                    {showAmountStatement(statement?.previousBalance)}
                  </Table.Td>
                </Table.Tr>

                {statement?.summaries &&
                  statement.summaries.map((summary, index) => {
                    if (Object.values(SummaryTypes).includes(summary.type)) {
                      return (
                        <>
                          <Table.Tr
                            className={
                              index % 2 === 0
                                ? ' bg-lightergrey hover:bg-gray-100'
                                : 'bg-white hover:bg-gray-100'
                            }>
                            <Table.Td>{SummaryTypesTextPair[summary.type]}</Table.Td>
                            <Table.Td className="text-right"></Table.Td>
                            <Table.Td className="text-right">
                              {showAmountStatement(summary.total)}
                            </Table.Td>
                          </Table.Tr>
                          {summary?.subSummaries &&
                            summary.subSummaries.map((subSummary) => {
                              if (Object.values(SubSummaryTypes).includes(subSummary.type)) {
                                let linkTo = `/billing/statement-summary/${statement.id}/transactions?type=${summary.type}&subType=${subSummary.type}`;

                                if (
                                  subSummary.type ===
                                  SubSummaryTypes.ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT
                                ) {
                                  linkTo += `&isPrevCycle=${!!subSummary?.isPrevCycle}`;
                                }

                                return (
                                  <Table.Tr
                                    className={
                                      index % 2 === 0
                                        ? ' bg-lightergrey hover:bg-gray-100'
                                        : 'bg-white hover:bg-gray-100'
                                    }>
                                    <Table.Td render={(props) => <Link {...props} to={linkTo} />}>
                                      <div className="pl-7">
                                        {subSummary.typeDescription ||
                                          SubSummaryTypesTextPair[subSummary.type]}
                                        <ExternalIcon className="inline ml-1" color="#00b0ff" />
                                      </div>
                                    </Table.Td>
                                    <Table.Td className="text-right">
                                      {showAmountStatement(subSummary.amount)}
                                    </Table.Td>
                                    <Table.Td className="text-right"></Table.Td>
                                  </Table.Tr>
                                );
                              }
                            })}
                        </>
                      );
                    }
                  })}
                <Table.Tr className={classRowTotal}>
                  <Table.Td></Table.Td>
                  <Table.Td className="text-right">Total credit (RM)</Table.Td>
                  <Table.Td className="text-right">
                    {formatMoney(Math.abs(statement?.totalCredit || 0))}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className={classRowTotal}>
                  <Table.Td></Table.Td>
                  <Table.Td className="text-right">Total debit (RM)</Table.Td>
                  <Table.Td className="text-right">
                    {formatMoney(Math.abs(statement?.totalDebit || 0))}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr className="bg-white hover:bg-gray-100">
                  <Table.Td></Table.Td>
                  <Table.Td className="text-right text-base font-bold">
                    {statement?.smartpayAccountFleetPlan === SmartpayAccountFleetPlans.PREPAID
                      ? 'Account balance (RM)'
                      : 'Amount due (RM)'}
                  </Table.Td>
                  <Table.Td className="text-right text-base font-bold">
                    {showAmountStatement(statement?.closingBalance)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </>
      )}
    </PageContainer>
  );
};
