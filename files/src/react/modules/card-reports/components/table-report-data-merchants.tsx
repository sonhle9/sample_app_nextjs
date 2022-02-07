import {
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableCaption,
  formatDate,
  BadgeProps,
  Badge,
} from '@setel/portal-ui';
import classNames from 'classnames';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {ReportData, ReportMapping} from 'src/react/services/api-reports.type';
import {ECardStatus} from '../enum';

type StatusColor = BadgeProps['color'];
interface ITableReportDataCommonProps {
  data: ReportData & ReportMapping;
  listColumnsNumber: string[];
}

export function statusColor(status: string): StatusColor {
  switch (status) {
    case ECardStatus.ACTIVE:
      return 'turquoise';
    case ECardStatus.FROZEN:
      return 'error';
    case ECardStatus.CLOSED:
    default:
      return 'grey';
  }
}

const displayContentTd = ({
  value,
  type,
  filed,
  listColumnsNumber,
}: {
  value: string;
  type: string;
  filed: string;
  listColumnsNumber: string[];
}) => {
  if (type === 'number' && listColumnsNumber.includes(filed)) {
    return convertToSensitiveNumber(value as any);
  }

  if (type === 'timestamp' || type === 'date') {
    return value && formatDate(value, {formatType: 'dateAndTime'});
  }

  if (Object.values(ECardStatus).includes(value as ECardStatus)) {
    return (
      <Badge color={statusColor(value as string)} rounded="rounded" className="uppercase">
        {value}
      </Badge>
    );
  }

  return value;
};

const TableReportDataMechants: React.VFC<ITableReportDataCommonProps> = ({
  data,
  listColumnsNumber,
}) => {
  return (
    <>
      <DataTableRowGroup groupType="thead">
        <Tr>
          {data.final_fields.map((field, fIndex) => (
            <Td
              key={fIndex}
              className={classNames({
                'text-right':
                  (data.final_column_types[fIndex] === 'number' && fIndex !== 0) ||
                  data.final_fields.length - 1 === fIndex,
              })}>
              {field}
            </Td>
          ))}
        </Tr>
      </DataTableRowGroup>
      <DataTableRowGroup groupType="tbody">
        {data.values.length === 0 ? (
          <DataTableCaption>
            <p className="absolute inset-x-0 p-6 text-center">No results.</p>
            <div className="w-full h-14"></div>
          </DataTableCaption>
        ) : (
          data.values.map((row, rIndex) => (
            <Tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <Td
                  key={cIndex}
                  className={classNames({
                    'text-right':
                      (data.final_column_types[cIndex] === 'number' && cIndex !== 0) ||
                      data.final_fields.length - 1 === cIndex,
                  })}>
                  {displayContentTd({
                    value: cell as string,
                    type: data.final_column_types[cIndex],
                    filed: data.final_fields[cIndex],
                    listColumnsNumber: listColumnsNumber,
                  })}
                </Td>
              ))}
            </Tr>
          ))
        )}
      </DataTableRowGroup>
    </>
  );
};

export default TableReportDataMechants;
