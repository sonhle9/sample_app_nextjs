import {
  Card,
  Checkbox,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  FilterControls,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {Link} from 'src/react/routing/link';
import {formatNumberToFixedString} from '../../terminal-switch-monthly-card-sales-report/terminal-switch-monthly-card-sales-report.helper';
import {downloadAndCompress} from '../terminal-switch-hourly-tnx-file.helper';
import {useHourlyTransactionFile} from '../terminal-switch-hourly-transaction-file.query';
import {IHourlyTransactionFile} from '../terminal-switch-hourly-transaction-file.type';

export const TerminalSwitchHourlyTransactionFileListing = () => {
  const filter = useFilter(
    {
      dateRange: ['', ''] as [string, string],
    },
    {
      components: [
        {
          key: 'dateRange',
          type: 'daterange',
          props: {
            label: 'Time range',
            disableFuture: true,
          },
        },
      ],
    },
  );

  const [{values}] = filter;

  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });
  const [isDownloading, setIsDownloading] = React.useState(false);

  const requestFilter = React.useMemo(
    () => ({
      from: values.dateRange[0],
      to: values.dateRange[1],
      page,
      perPage,
    }),
    [values, page, perPage],
  );

  const {data, isFetching, isError} = useHourlyTransactionFile(requestFilter);

  const [checkedHourlyTransactionFile, setCheckedHourlyTransactionFile] = React.useState<
    Set<string>
  >(new Set());
  const [checkAllState, setCheckAllState] = React.useState(false);

  const hourlyTnxFileCanDownloadFilter = (hourlyTnxFile: IHourlyTransactionFile) => {
    return hourlyTnxFile.hours.every((hour) => hour.isGenerated);
  };

  const numOfDayCanDownload = data?.hourlyTnxFiles.filter(hourlyTnxFileCanDownloadFilter).length;

  React.useEffect(() => {
    setPage(1);
    setPerPage(20);
  }, [values]);

  React.useEffect(() => {
    setCheckedHourlyTransactionFile(new Set());
  }, [requestFilter]);

  React.useEffect(() => {
    if (
      checkedHourlyTransactionFile.size === numOfDayCanDownload &&
      checkedHourlyTransactionFile.size !== 0
    ) {
      setCheckAllState(true);
      return;
    }
    setCheckAllState(false);
  }, [checkedHourlyTransactionFile]);

  const isEmptyHourlyTnxFile = data && data.hourlyTnxFiles && data.hourlyTnxFiles.length === 0;

  const checkAll = () => {
    if (checkedHourlyTransactionFile.size === numOfDayCanDownload) {
      setCheckedHourlyTransactionFile(new Set());
      return;
    }
    setCheckedHourlyTransactionFile(
      new Set([
        ...checkedHourlyTransactionFile,
        ...data?.hourlyTnxFiles.filter(hourlyTnxFileCanDownloadFilter).map((item) => item.id),
      ]),
    );
  };
  const onDownload = async () => {
    const records = data.hourlyTnxFiles
      .filter((hourlyTransactionFile) => {
        return checkedHourlyTransactionFile.has(hourlyTransactionFile.id);
      })
      .filter(hourlyTnxFileCanDownloadFilter)
      .flatMap((hourlyTransactionFile) => {
        return hourlyTransactionFile.hours;
      })
      .map((hourlyRecord) => {
        return hourlyRecord.s3ObjectKey;
      });
    setIsDownloading(true);
    await downloadAndCompress(records, 'hourly-transaction-file.zip');
    setIsDownloading(false);
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Card>
          <Card.Heading title="Hourly transaction file">
            {!isError && (
              <DownloadCsvDropdown
                isDownloading={isDownloading}
                disabled={checkedHourlyTransactionFile.size === 0}
                variant="outline"
                onDownload={onDownload}
              />
            )}
          </Card.Heading>
          <Card.Content className="p-0">
            <FilterControls filter={filter} className="pl-7 px-5 rounded-none" />
            <DataTable
              isLoading={isFetching}
              striped
              pagination={
                <PaginationNavigation
                  total={data && data.total}
                  currentPage={page}
                  perPage={perPage}
                  onChangePage={setPage}
                  onChangePageSize={setPerPage}
                />
              }>
              <DataTableRowGroup groupType="thead">
                <DataTableRow>
                  <DataTableCell className="w-4 pl-7">
                    <Checkbox
                      data-testid="check-all-button-id"
                      checked={checkAllState}
                      onChangeValue={checkAll}
                    />
                  </DataTableCell>
                  <DataTableCell className="p-0">REPORT FOLDER</DataTableCell>
                  <DataTableCell className="text-right">GENERATED ON</DataTableCell>
                </DataTableRow>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {!isFetching &&
                  !isEmptyHourlyTnxFile &&
                  data.hourlyTnxFiles.map((item) => {
                    const dateTime = new Date(item.date);
                    const year = dateTime.getFullYear();
                    const month = dateTime.getMonth() + 1;
                    const date = dateTime.getDate();
                    const disabledCheckBox = !item.hours.every((hour) => hour.isGenerated);
                    return (
                      <DataTableRow key={item.id}>
                        <DataTableCell className="w-4 pl-7">
                          <Checkbox
                            className={`border-2 ${
                              disabledCheckBox
                                ? 'border-carbon-100 bg-lightergrey'
                                : 'border-controlborder'
                            }`}
                            disabled={disabledCheckBox}
                            checked={checkedHourlyTransactionFile.has(item.id)}
                            onChangeValue={() => {
                              if (checkedHourlyTransactionFile.has(item.id)) {
                                setCheckedHourlyTransactionFile(
                                  new Set(
                                    [...checkedHourlyTransactionFile].filter(
                                      (key) => key !== item.id,
                                    ),
                                  ),
                                );
                                return;
                              }
                              setCheckedHourlyTransactionFile(
                                new Set([...checkedHourlyTransactionFile, item.id]),
                              );
                            }}
                          />
                        </DataTableCell>
                        <DataTableCell
                          render={(props) => (
                            <Link
                              data-testid="terminal-switch-hourly-transaction-file"
                              to={`gateway/csv-reports/hourly-transaction-file-detail/${item.id}`}
                              {...props}
                            />
                          )}
                          className="p-0">{`${year}${formatNumberToFixedString(
                          month,
                          2,
                        )}${formatNumberToFixedString(date, 2)}`}</DataTableCell>
                        <DataTableCell className="text-right">{`${formatDate(item.date, {
                          format: 'd MMMM yyyy, HH:mm:SS',
                        })}`}</DataTableCell>{' '}
                      </DataTableRow>
                    );
                  })}
              </DataTableRowGroup>
              <DataTableCaption>
                {!isFetching && isEmptyHourlyTnxFile && (
                  <div className="py-12">
                    <p className="text-center text-gray-400 text-sm">
                      No hourly transaction file was found
                    </p>
                  </div>
                )}
              </DataTableCaption>
            </DataTable>
          </Card.Content>
        </Card>
      </div>
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
