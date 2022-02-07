import {
  createArray,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Skeleton,
} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {useReportDataPreview} from '../on-demand-reports.queries';

export type OnDemandReportDataViewerProps = {
  reportId: string;
  params: Record<string, string | number>;
};

/**
 * OnDemandReportDataPreview allows you to preview the output data for a report.
 */
export const OnDemandReportDataPreview = (props: OnDemandReportDataViewerProps) => {
  const {data, isLoading} = useReportDataPreview(props);

  return (
    <DataTable isLoading={isLoading}>
      <DataTableRowGroup groupType="thead">
        <Tr>
          {data
            ? data.final_fields.map((field, fIndex) => (
                <Td
                  className={cx(data.final_column_types[fIndex] === 'number' && 'text-right')}
                  key={fIndex}>
                  {field}
                </Td>
              ))
            : createArray(5).map((_, i) => (
                <Td key={i}>
                  <Skeleton />
                </Td>
              ))}
        </Tr>
      </DataTableRowGroup>
      <DataTableRowGroup>
        {data &&
          data.values.map((row, rIndex) => (
            <Tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <Td
                  className={cx(data.final_column_types[cIndex] === 'number' && 'text-right')}
                  key={cIndex}>
                  {cell}
                </Td>
              ))}
            </Tr>
          ))}
      </DataTableRowGroup>
    </DataTable>
  );
};
