import {
  Alert,
  Button,
  Card,
  classes,
  DataTable,
  DataTableCaption,
  DescList,
  Notification,
  PaginationNavigation,
  usePaginationState,
  useTransientState,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {SkeletonDescItem} from 'src/react/components/skeleton-display';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {CARD_OPTIONS_NAME} from '../constant';
import {
  downloadTerminalSwitchMonthlyCardSalesReport,
  sentTerminalSwitchMonthlyCardSalesReportViaEmail,
} from '../terminal-switch-monthly-card-sale-report.service';
import {formatMonthYear} from '../terminal-switch-monthly-card-sales-report.helper';
import {
  useDidMountEffect,
  useTerminalSwitchCardSalesReport,
} from '../terminal-switch-monthly-card-sales-report.query';
import {IMonthlyCardSalesReportFilter} from '../terminal-switch-monthly-card-sales-report.type';
import {MonthlyCardSalesReportFilterModal} from './change-monthly-report-filter.modal';
import {MonthlyCardSalesReportTableBody} from './monthly-card-sales-report-table-body';
import {MonthlyCardSalesReportTableHeader} from './monthly-card-sales-report-table-header';

export const TerminalSwitchMonthlyCardSalesReportListing = () => {
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });
  const [filter, setFilter] = useState<IMonthlyCardSalesReportFilter>(
    {} as IMonthlyCardSalesReportFilter,
  );
  const [didFilter, setDidFilter] = useState(false);

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);

  React.useEffect(() => {
    setPage(1);
  }, [filter]);

  useDidMountEffect(() => {
    setDidFilter(true);
  }, [filter]);
  const requestFilter = React.useMemo(
    () => ({
      cardBrand: filter?.cardBrand,
      merchantId: filter?.merchantId,
      startMonth: filter?.startMonth,
      startYear: filter?.startYear,
      endMonth: filter?.endMonth,
      endYear: filter?.endYear,
      page,
      perPage,
    }),
    [filter, page, perPage],
  );

  const [showFilterControl, setShowFilterControl] = useState(false);

  const {data, isFetching, isError} = useTerminalSwitchCardSalesReport(requestFilter);

  const isEmptyCardSaleReportList =
    data && data.monthlyCardSalesReport && data.monthlyCardSalesReport.length === 0;

  const downloadCsv = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilter;
    return downloadTerminalSwitchMonthlyCardSalesReport(rest);
  }, [requestFilter]);
  const sendEmailCsv = React.useCallback(
    async (emails: string[]) => {
      const {page, perPage, ...rest} = requestFilter;
      await sentTerminalSwitchMonthlyCardSalesReportViaEmail(emails, rest)
        .then(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('success');
        })
        .catch(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('error');
        });
    },
    [requestFilter],
  );

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <div className="self-center">
            <h1 className={`${classes.h1}`}>Monthly card sales report</h1>
          </div>

          {!isFetching && !isError && (
            <div className="flex flex-wrap items-center space-x-2">
              {didFilter && (
                <DownloadCsvDropdown
                  variant="outline"
                  onDownload={() => downloadCsv()}
                  onSendEmail={sendEmailCsv}
                  emailModalTitle={'Send email'}
                />
              )}
              <Button
                data-testid="monthly-card-sale-report-generate-button"
                variant="primary"
                onClick={() => {
                  setShowFilterControl(true);
                }}>
                GENERATE
              </Button>
            </div>
          )}
        </div>

        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}

        <Card>
          <Card.Heading title="Attributes" />
          <Card.Content className="p-7">
            <div>
              <Alert
                className="mb-5"
                variant="info"
                description="Kindly click on the Generate button to input the generate details.."
              />
              <DescList className="mb-5">
                <SkeletonDescItem
                  label="Time range"
                  value={
                    didFilter
                      ? `${formatMonthYear(
                          filter.startMonth,
                          filter.startYear,
                        )} - ${formatMonthYear(filter.endMonth, filter.endYear)} `
                      : '-'
                  }
                  isLoading={false}
                />
              </DescList>
              <DescList className="mb-5">
                <SkeletonDescItem
                  label="Card type"
                  value={filter.cardBrand ? CARD_OPTIONS_NAME[filter.cardBrand] : '-'}
                  isLoading={false}
                />
              </DescList>
              <DescList>
                <SkeletonDescItem
                  label="Merchant"
                  value={filter.merchantName ? filter.merchantName : '-'}
                  isLoading={false}
                />
              </DescList>
            </div>
          </Card.Content>
        </Card>
        <MonthlyCardSalesReportFilterModal
          data-testid="monthly-card-sale-report-filter-modal"
          filter={filter}
          setFilter={setFilter}
          isOpen={showFilterControl}
          onClose={() => {
            setShowFilterControl(false);
          }}
        />
        <DataTable
          className="table-fixed"
          isLoading={isFetching}
          striped
          pagination={
            <PaginationNavigation
              onChangePage={setPage}
              onChangePageSize={setPerPage}
              total={data && data.total}
              currentPage={page}
              perPage={perPage}
            />
          }>
          <MonthlyCardSalesReportTableHeader filter={filter} />
          {didFilter && (
            <MonthlyCardSalesReportTableBody
              data={data}
              isFetching={isFetching}
              isEmptyCardSaleReportList={isEmptyCardSaleReportList}
            />
          )}

          <DataTableCaption>
            {((!isFetching && isEmptyCardSaleReportList) || !didFilter) && (
              <div className="py-12 w-screen">
                <p className="text-center text-gray-400 text-sm">No item found.</p>
              </div>
            )}
          </DataTableCaption>
        </DataTable>

        <Notification
          isShow={showNoti}
          variant={notiType}
          title={
            notiType === 'success'
              ? 'Request successfully. The csv will be sent shortly.'
              : 'Fail to request.'
          }
        />
      </div>
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
