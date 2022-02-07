import {DataTableCell, DataTableRow, DataTableRowGroup} from '@setel/portal-ui';
import React from 'react';
import {DEFAULT_COL_WIDTH, HEADER_MONTHLY_CARD_SALE_REPORT_MAPPER} from '../constant';
import {IMonthlyCardSalesReportFilter} from '../terminal-switch-monthly-card-sales-report.type';

const generateCardHeader = (cardBrandText: string) => {
  return [
    <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
      {`${cardBrandText.toUpperCase()} TOTAL TXN N0`}
    </DataTableCell>,
    <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>
      {`${cardBrandText.toUpperCase()} TOTAL TXN AMT (RM)`}
    </DataTableCell>,
    <DataTableCell
      className={`${DEFAULT_COL_WIDTH}`}>{`${cardBrandText.toUpperCase()} LITRE`}</DataTableCell>,
    <DataTableCell
      className={`${DEFAULT_COL_WIDTH}`}>{`${cardBrandText.toUpperCase()} LITRE AMT`}</DataTableCell>,
  ];
};

const generateHeaderFromFilter = (filter: IMonthlyCardSalesReportFilter) => {
  if (!filter.cardBrand) {
    return Object.values(HEADER_MONTHLY_CARD_SALE_REPORT_MAPPER).flatMap((names) => {
      return names.map((name) => generateCardHeader(name));
    });
  }
  return HEADER_MONTHLY_CARD_SALE_REPORT_MAPPER[filter.cardBrand].map((mapping: string) =>
    generateCardHeader(mapping),
  );
};

export const MonthlyCardSalesReportTableHeader = (props: {
  filter: IMonthlyCardSalesReportFilter;
}) => {
  return (
    <>
      <DataTableRowGroup groupType="thead">
        <DataTableRow className="flex">
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>DATE(YYYYMM)</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>MERCHANT NAME/ID</DataTableCell>
          {...generateHeaderFromFilter(props?.filter)}
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>TOTAL TXN</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>TOTAL AMT(RM)</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH}`}>TOTAL LITRE</DataTableCell>
          <DataTableCell className={`${DEFAULT_COL_WIDTH} text-right`}>
            TOTAL LITRE AMT
          </DataTableCell>
        </DataTableRow>
      </DataTableRowGroup>
    </>
  );
};
