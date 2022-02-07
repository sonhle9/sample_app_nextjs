import {
  Card,
  Checkbox,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  Text,
  usePaginationState,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as momentTz from 'moment-timezone';
import * as React from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {DEFAULT_TIME_ZONE} from '../constant';
import {downloadAndCompressFullMidTidMapping} from '../terminal-switch-full-mid-tid-mapping.helper';
import {useFullMidTidReport as useFullMidTidReport} from '../terminal-switch-full-mid-tid-mapping.query';
import {generateFullMidTidReport as generateFullMidTidReport} from '../terminal-switch-full-mid-tid-mapping.service';
import {MonthRangePicker} from './month-range-picker';

export const TerminalSwitchFullMidTidMappingReportsListing = () => {
  const [startMonth, setStartMonth] = React.useState<Date>(null);
  const [endMonth, setEndMonth] = React.useState<Date>(null);

  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    setPage(1);
    setPerPage(20);
  }, [startMonth, endMonth]);

  const requestFilter = React.useMemo(
    () => ({
      monthFrom: !_.isUndefined(startMonth?.getMonth()) ? startMonth?.getMonth() + 1 : undefined,
      yearFrom: startMonth?.getFullYear(),
      monthTo: !_.isUndefined(endMonth?.getMonth()) ? endMonth?.getMonth() + 1 : undefined,
      yearTo: endMonth?.getFullYear(),
      page,
      perPage,
    }),
    [startMonth, endMonth, page, perPage],
  );

  const {data, isFetching, isError, refetch} = useFullMidTidReport(requestFilter);

  const isEmptyFullMidTidReport =
    data && data.fullMidTidReports && data.fullMidTidReports.length === 0;

  const [checkedFullMidTidReport, setCheckedFullMidTidReport] = React.useState<Set<string>>(
    new Set(),
  );

  React.useEffect(() => {
    setCheckedFullMidTidReport(new Set());
  }, [startMonth, endMonth, page, perPage]);

  const onDownload = async () => {
    setIsDownloading(true);
    await downloadAndCompressFullMidTidMapping(
      [...checkedFullMidTidReport],
      'full-mid-tid-report.zip',
    );
    setIsDownloading(false);
  };

  const onGenerateClick = async (month: number, year: number) => {
    await generateFullMidTidReport({month, year});
    refetch();
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Card>
          <Card.Heading title="Full MID & TID mapping monthly report">
            {!isError && (
              <DownloadCsvDropdown
                isDownloading={isDownloading}
                disabled={checkedFullMidTidReport.size === 0}
                variant="outline"
                onDownload={onDownload}
              />
            )}
          </Card.Heading>
          <Card.Content className="p-0">
            <div className="py-5 pl-7">
              <div>
                <Text className="text-sm text-mediumgrey">Time range</Text>
              </div>
              <div>
                <MonthRangePicker setStartMonth={setStartMonth} setEndMonth={setEndMonth} />
              </div>
            </div>
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
                  <DataTableCell className="pl-7">FILE</DataTableCell>
                  <DataTableCell className="text-right">GENERATED ON</DataTableCell>
                </DataTableRow>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {!isFetching &&
                  !isEmptyFullMidTidReport &&
                  data.fullMidTidReports.map((item) => {
                    return (
                      <DataTableRow key={item.id} data-testid="legacy-terminal-full-mid-tid-report">
                        <DataTableCell>
                          <div className="flex items-center">
                            <Checkbox
                              disabled={!item.isGenerated}
                              data-testid={'check-item-button'}
                              className={`border-2 ${
                                !item.isGenerated
                                  ? 'border-carbon-100 bg-lightergrey'
                                  : 'border-controlborder'
                              }`}
                              checked={checkedFullMidTidReport.has(item.s3ObjectKey)}
                              onChangeValue={() => {
                                if (checkedFullMidTidReport.has(item.s3ObjectKey)) {
                                  setCheckedFullMidTidReport(
                                    new Set(
                                      [...checkedFullMidTidReport].filter(
                                        (key) => key !== item.s3ObjectKey,
                                      ),
                                    ),
                                  );
                                  return;
                                }
                                setCheckedFullMidTidReport(
                                  new Set([...checkedFullMidTidReport, item.s3ObjectKey]),
                                );
                              }}
                            />
                            <div className="p-2 bd-highlight">{item.fileName}</div>
                          </div>
                        </DataTableCell>
                        <DataTableCell className="text-right align-middle">
                          {item.isGenerated ? (
                            `${formatDate(item.generatedAt, {
                              format: 'd MMMM yyyy, HH:mm:SS',
                            })}`
                          ) : (
                            <Text
                              onClick={() => {
                                const scheduleDate = momentTz.tz(
                                  item.scheduleDate,
                                  DEFAULT_TIME_ZONE,
                                );
                                onGenerateClick(scheduleDate.month() + 1, scheduleDate.year());
                              }}
                              className={`${classes.label} text-brand-500 cursor-pointer`}>
                              GENERATE
                            </Text>
                          )}
                        </DataTableCell>{' '}
                      </DataTableRow>
                    );
                  })}
              </DataTableRowGroup>
              <DataTableCaption>
                {!isFetching && isEmptyFullMidTidReport && (
                  <div className="py-12">
                    <p className="text-center text-gray-400 text-sm">
                      No full mid tid mapping monthly report file was found
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
