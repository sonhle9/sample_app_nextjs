import {
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableCaption,
} from '@setel/portal-ui';
import classNames from 'classnames';
import moment from 'moment';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {ReportData, ReportMapping} from 'src/react/services/api-reports.type';

interface ITableReportDataCommonProps {
  data: ReportData & ReportMapping;
  listColumnsDate: string[];
  listColumnsNumber: string[];
  listColumnsPhoneNumber: string[];
  listColumnsNumber3decimal: string[];
}

const displayContentTd = ({
  value,
  type,
  filed,
  listColumnsNumber,
  listColumnsDate,
  listColumnsPhoneNumber,
  listColumnsNumber3decimal,
}: {
  value: string;
  type: string;
  filed: string;
  listColumnsDate: string[];
  listColumnsNumber: string[];
  listColumnsPhoneNumber: string[];
  listColumnsNumber3decimal: string[];
}) => {
  if (listColumnsNumber.includes(filed)) {
    return convertToSensitiveNumber(value as any);
  }

  if (listColumnsNumber3decimal.includes(filed)) {
    return convertToSensitiveNumber(value as any, 3, 3);
  }

  if (type === 'timestamp' || type === 'date' || listColumnsDate.includes(filed)) {
    return value && moment(value, 'DD/MM/YYYY').format('D MMM YYYY');
  }

  if (listColumnsPhoneNumber.includes(filed)) {
    return value && `+${value.substring(0, 3)}-${value.substring(3, value.length)}`;
  }

  return value;
};

const TableReportDataCommon: React.VFC<ITableReportDataCommonProps> = ({
  data,
  listColumnsNumber,
  listColumnsDate,
  listColumnsPhoneNumber,
  listColumnsNumber3decimal,
}) => {
  return (
    <>
      <DataTableRowGroup groupType="thead">
        <Tr>
          {data.final_fields?.map((field, fIndex) => (
            <Td
              key={fIndex}
              className={classNames({
                'min-w-40': true,
                'text-right':
                  data.final_fields?.length - 1 === fIndex ||
                  [...listColumnsNumber, ...listColumnsNumber3decimal].includes(
                    data.final_fields[fIndex],
                  ),
              })}>
              {field}
            </Td>
          ))}
        </Tr>
      </DataTableRowGroup>
      <DataTableRowGroup groupType="tbody">
        {data.values?.length === 0 ? (
          <DataTableCaption className="py-5">
            <b className="absolute inset-x-0 py-5 text-center font-normal">
              You have no data to be displayed here
            </b>
            <div className="w-full h-14"></div>
          </DataTableCaption>
        ) : (
          data.values?.map((row, rIndex) => (
            <Tr key={rIndex}>
              {row?.map((cell, cIndex) => (
                <Td
                  key={cIndex}
                  className={classNames({
                    capitalize: data.final_fields[cIndex] !== 'Email',
                    'text-right':
                      data.final_fields?.length - 1 === cIndex ||
                      [...listColumnsNumber, ...listColumnsNumber3decimal].includes(
                        data.final_fields[cIndex],
                      ),
                  })}>
                  {displayContentTd({
                    value: cell as string,
                    type: data.final_column_types[cIndex],
                    filed: data.final_fields[cIndex],
                    listColumnsDate,
                    listColumnsNumber,
                    listColumnsPhoneNumber,
                    listColumnsNumber3decimal,
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

export default TableReportDataCommon;
