import {
  Button,
  createArray,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DATES,
  DownloadIcon,
  Modal,
  ModalBody,
  ModalHeader,
  PaginationNavigation,
  Skeleton,
  SpinIcon,
  useFilter,
  usePaginationState,
  FilterControls,
  Filter,
  Badge,
} from '@setel/portal-ui';
import cx from 'classnames';
import formatISO from 'date-fns/formatISO';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useNotification} from 'src/react/hooks/use-notification';
import {OnDemandReportMappingType} from 'src/react/services/api-reports.enum';
import {ReportData, ReportMapping} from 'src/react/services/api-reports.type';
import {DataViewerFields} from '../on-demand-reports.enums';
import {useReportData} from '../on-demand-reports.queries';
import {SendReportForm} from './on-demand-report-send-report-form';

export type OnDemandReportDataViewerProps = {
  reportName: string;
  category: string;
  url: string;
  pageSize?: number;
  staleTime?: number;
};

/**
 * ReportViewer renders reports that is configured in `api-reports`.
 */
export const OnDemandReportDataViewer = (props: OnDemandReportDataViewerProps) => {
  const pagination = usePaginationState({
    initialPerPage: props.pageSize,
  });

  const filter = useFilter(
    {
      range: [dateOptions[2].value, ''] as [string, string],
    },
    {
      components: [
        {
          key: 'range',
          type: 'daterange',
          props: {
            customRangeFormatType: 'dateOnly',
            label: 'Date',
            options: dateOptions,
          },
        },
      ],
    },
  );

  const [{values}] = filter;

  const {data: resolvedData, isFetching} = useReportData({
    url: props.url,
    category: props.category,
    perPage: pagination.perPage,
    page: pagination.page,
    staleTime: props.staleTime,
    date_range_start: values.range[0],
    date_range_end: values.range[1],
  });

  const [showSendModal, setShowSendModal] = React.useState(false);
  const dismissSendModal = () => setShowSendModal(false);
  const showMessage = useNotification();

  const nodata =
    !resolvedData ||
    resolvedData
      .filter((data) => !data.exportOnly)
      .every((tableData) => (tableData.values ? tableData.values.length === 0 : true));

  return (
    <PageContainer
      heading={props.reportName}
      action={
        <Button
          onClick={() => setShowSendModal(true)}
          variant="outline"
          leftIcon={<DownloadIcon />}
          disabled={nodata}>
          DOWNLOAD
        </Button>
      }>
      <Modal aria-label="send report" isOpen={showSendModal} onDismiss={dismissSendModal}>
        <ModalHeader>Send Report</ModalHeader>
        <ModalBody>
          This CSV file will be sent to the email you enter down below. You may enter multiple email
          addresses separated by commas.
        </ModalBody>
        <SendReportForm
          reportName={props.reportName}
          filter={{date_range_start: values.range[0], date_range_end: values.range[1]}}
          onSuccess={() => {
            showMessage({
              title: 'Report requested',
              description: 'You will be notified when the report is ready.',
            });
            dismissSendModal();
          }}
          onDismiss={dismissSendModal}
        />
      </Modal>
      {resolvedData ? (
        <>
          {resolvedData
            .filter((data) => !data.exportOnly)
            .map((tableData, tIndex) => (
              <div className="mb-4" key={tIndex}>
                <DataDisplay
                  data={tableData}
                  onChangePage={pagination.setPage}
                  onChangePageSize={pagination.setPerPage}
                  filter={filter}
                />
              </div>
            ))}
          {isFetching && <SpinIcon className="fixed bottom-4 right-4 w-8 h-8 animate-spin" />}
        </>
      ) : (
        <DataTable isLoading={true}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              {createArray(5).map((_, i) => (
                <Td key={i}>
                  <Skeleton />
                </Td>
              ))}
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup></DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};

const dateOptions = [
  {
    label: 'Any date',
    value: formatISO(new Date(2000, 0, 0)),
  },
  {
    label: 'Yesterday',
    value: formatISO(DATES.yesterday),
  },
  {
    label: 'Last 7 days',
    value: formatISO(DATES.sevenDaysAgo),
  },
  {
    label: 'Last 30 days',
    value: formatISO(DATES.thirtyDaysAgo),
  },
];

const DataDisplay = ({
  data,
  onChangePage,
  onChangePageSize,
  filter,
}: {
  data: ReportData & ReportMapping;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
  filter: ReturnType<typeof useFilter>;
}) => {
  if (data.mappingType === OnDemandReportMappingType.SUMMARY) {
    return (
      <table className="min-w-full">
        <tbody>
          {data.values.map((row, rIndex) => (
            <tr key={rIndex}>
              <Td render={(props) => <td {...props} />}>{row[0]}</Td>
              <Td className="text-right" render={(props) => <td {...props} />}>
                {row[1]}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const [{applied}, {reset}] = filter;
  return (
    <div className="relative">
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      <DataTable
        pagination={
          data &&
          data.paginated && (
            <PaginationNavigation
              onChangePage={onChangePage}
              onChangePageSize={onChangePageSize}
              total={data.paginated.record_count}
              currentPage={data.paginated.page}
              perPage={data.paginated.page_size}
            />
          )
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            {sanitize(data.final_fields).map((field, fIndex) => (
              <Td
                className={cx(data.final_column_types[fIndex] === 'number' && 'text-right')}
                key={fIndex}>
                {field}
              </Td>
            ))}
          </Tr>
        </DataTableRowGroup>
        {data.values.length === 0 ? (
          <DataTableCaption>
            <p className="absolute inset-x-0 p-6 text-center">No results.</p>
            <div className="w-full h-14"></div>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data.values.map((row, rIndex) => (
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
        )}
      </DataTable>
    </div>
  );
};

const sanitize = (array: string[]) =>
  array.map((item) => {
    item = item.toLowerCase().replace(/_/g, ' ');
    return DataViewerFields[item] ? (item = DataViewerFields[item]) : item;
  });
