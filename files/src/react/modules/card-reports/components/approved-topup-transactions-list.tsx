import {
  Button,
  Card,
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DateRangeDropdown,
  Field,
  Label,
  Modal,
  ModalBody,
  PaginationNavigation,
  SearchableDropdown,
  Text,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {useNotification} from 'src/react/hooks/use-notification';
import {OnDemandReportCategory} from 'src/react/services/api-reports.enum';
import {SendReportForm} from '../../on-demand-reports/components/on-demand-report-send-report-form';
import {useGetMerChants} from '../../transactions/transaction.queries';
import {useCardReportsDetails, useReportDataCustom} from '../card-reports.queries';
import {onDemandReportUrls} from '../enum';
import TableReportDataMechants from './table-report-data-merchants';

const listColumnsNumber = ['amount'];

const ApprovedAdjustmentTransactionList: React.VFC = () => {
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [person, setPerson] = React.useState('');
  const [searchText, setSearchText] = React.useState('');
  const [dateRange, setDateRange] = React.useState(['', '']);

  const pagination = usePaginationState();
  const [{values}, {setValue}] = useFilter({
    dateRange_start: dateRange[0],
    dateRange_end: dateRange[1],
    merchantId: '',
    clientTz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const {data: resolvedData, isFetching} = useReportDataCustom({
    url: onDemandReportUrls.APPROVED_TOPUP_TRANSACTIONS,
    category: OnDemandReportCategory.CARD, // change category to fix download with link /card-issuing/reports/download....
    perPage: pagination.perPage,
    page: pagination.page,
    ...values,
  });
  const {data: reportDetails} = useCardReportsDetails(
    OnDemandReportCategory.CARD, // change category to fix download with link /card-issuing/reports/download....
    onDemandReportUrls.APPROVED_TOPUP_TRANSACTIONS,
  );

  const data = React.useMemo(() => {
    return resolvedData && resolvedData.filter((item) => !item.exportOnly).filter(Boolean)[0];
  }, [resolvedData]);
  const summaryData = React.useMemo(() => {
    return resolvedData && resolvedData.filter((item) => !item.exportOnly).filter(Boolean)[1];
  }, [resolvedData]);

  const {data: dataMerchants} = useGetMerChants({
    page: 1,
    perPage: 100,
    searchValue: searchText,
  });

  const optMerchants = (dataMerchants || []).reduce((arr, obj) => {
    arr.push({
      label: obj.name,
      value: obj.merchantId,
      description: obj.legalName,
    });
    return arr;
  }, []);

  const dismissSendModal = React.useCallback(() => {
    setShowSendModal(false);
  }, []);

  const showMessage = useNotification();

  return (
    <>
      <div className="grid gap-4 pt-6 max-w-6xl mx-auto px-4 sm:px-6 mb-15 relative">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Approved merchant top up transactions</h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowSendModal(true);
            }}>
            DOWNLOAD CSV
          </Button>
        </div>
        <Card className="mb-4">
          <div className="grid grid-cols-4 gap-5 p-5">
            <Field>
              <Label>Merchant name</Label>
              <SearchableDropdown
                value={person}
                onChangeValue={(value) => {
                  pagination.setPage(1);
                  setPerson(value);
                  setValue('merchantId', value);
                }}
                options={optMerchants}
                onInputValueChange={setSearchText}
                placeholder="All merchants"
              />
            </Field>
            <Field>
              <DateRangeDropdown
                label="Transaction date"
                value={[dateRange[0], dateRange[1]]}
                onChangeValue={(value) => {
                  pagination.setPage(1);
                  setValue('dateRange_start', value[0]);
                  setValue('dateRange_end', value[1]);
                  setDateRange([value[0], value[1]]);
                }}
                dayOnly
                disableFuture
                customRangeFormatType="dateOnly"
              />
            </Field>
          </div>
          {!!values.merchantId && !isFetching && (
            <div className="pl-5 pb-5">
              {summaryData &&
                summaryData.values.map((s, index) => {
                  return (
                    <Text color="darkgrey" key={index}>
                      {s[0]} {convertToSensitiveNumber(s[1] as number)}
                    </Text>
                  );
                })}
            </div>
          )}
        </Card>
        <DataTable
          striped
          isLoading={isFetching}
          pagination={
            data &&
            data.paginated && (
              <PaginationNavigation
                onChangePage={pagination.setPage}
                total={data.paginated.record_count}
                currentPage={data.paginated.page}
                perPage={data.paginated.page_size}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          {!resolvedData && (
            <>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td>TRANSACTION ID</Td>
                  <Td>TRANSACTION DATE</Td>
                  <Td>PAYMENT METHOD</Td>
                  <Td>AMOUNT</Td>
                  <Td>MERCHANT NAME</Td>
                  <Td>REFERENCE</Td>
                  <Td>ASSIGNMENT</Td>
                  <Td className="text-right">TOPUP TARGET</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody"></DataTableRowGroup>
            </>
          )}
          {data && <TableReportDataMechants data={data} listColumnsNumber={listColumnsNumber} />}
        </DataTable>
      </div>
      {/* send email modal*/}
      <Modal aria-label="send report" isOpen={showSendModal} onDismiss={dismissSendModal}>
        <ModalBody>
          This CSV file will be sent to the email you enter down below. You may enter multiple email
          addresses separated by commas.
        </ModalBody>
        <SendReportForm
          reportName={reportDetails?.reportName}
          filter={{...values, clientTz: Intl.DateTimeFormat().resolvedOptions().timeZone}}
          onSuccess={() => {
            showMessage({
              title: 'Report requested.',
              description: 'You will be notified when the report is ready.',
            });
            dismissSendModal();
          }}
          onDismiss={dismissSendModal}
        />
      </Modal>
      {/* send email modal - END */}
    </>
  );
};

export default ApprovedAdjustmentTransactionList;
