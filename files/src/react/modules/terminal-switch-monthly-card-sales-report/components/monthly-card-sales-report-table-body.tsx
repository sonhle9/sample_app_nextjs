import {DataTableCell, DataTableRow, DataTableRowGroup, formatMoney} from '@setel/portal-ui';
import * as momentTz from 'moment-timezone';
import React from 'react';
import {DEFAULT_TIME_ZONE} from '../../terminal-switch-csv-reports/constant';
import {DEFAULT_COL_WIDTH} from '../constant';
import {formatNumberToFixedString} from '../terminal-switch-monthly-card-sales-report.helper';
import {MonthlyCardSaleReportResponseDTO} from '../terminal-switch-monthly-card-sales-report.type';

export const MonthlyCardSalesReportTableBody = (props: {
  data: {
    monthlyCardSalesReport: MonthlyCardSaleReportResponseDTO[];
    total: number;
  };
  isFetching: boolean;
  isEmptyCardSaleReportList: boolean;
}) => {
  const {data, isFetching, isEmptyCardSaleReportList} = props;
  const mapCardSalesReportToRow = (doc: MonthlyCardSaleReportResponseDTO) => {
    const {
      reportDate,
      merchantId,
      merchantName,
      cards,
      totalAmount,
      totalLitre,
      totalLitreAmount,
      totalTransaction,
      id,
    } = doc;

    const month = momentTz.tz(reportDate, DEFAULT_TIME_ZONE).month() + 1;
    const year = momentTz.tz(reportDate, DEFAULT_TIME_ZONE).year();

    return (
      <>
        <DataTableRow data-testid="terminal-switch-monthly-card-sales-report-row" className="flex">
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>{`${year}${formatNumberToFixedString(
            month,
            2,
          )}`}</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
            <div className="flex-col">
              <p className="text-sm">{merchantName}</p>
              <p className="text-xs" style={{color: '#788494'}}>
                {merchantId}
              </p>
            </div>
          </DataTableCell>
          {...cards.map((card, index) => (
            <React.Fragment key={`${id}-${index}`}>
              <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
                {card.transactionNumber}
              </DataTableCell>
              <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
                {formatMoney(card.amount)}
              </DataTableCell>
              <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
                {formatMoney(card.litre)}
              </DataTableCell>
              <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
                {formatMoney(card.litreAmount)}
              </DataTableCell>
            </React.Fragment>
          ))}
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>{totalTransaction}</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
            {formatMoney(totalAmount)}
          </DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
            {formatMoney(totalLitre)}
          </DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH} text-right`}>
            {formatMoney(totalLitreAmount)}
          </DataTableCell>
        </DataTableRow>
      </>
    );
  };
  return (
    <>
      <DataTableRowGroup>
        {!isFetching &&
          !isEmptyCardSaleReportList &&
          data.monthlyCardSalesReport.map((item, index) => {
            return (
              <React.Fragment key={`monley-card-sale-report-row-${index}`}>
                {mapCardSalesReportToRow(item)}
              </React.Fragment>
            );
          })}
      </DataTableRowGroup>
    </>
  );
};
