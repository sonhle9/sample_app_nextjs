import {
  Button,
  Card,
  classes,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DaySelector,
  DropdownSelect,
  Field,
  Label,
  Modal,
  ModalBody,
  PaginationNavigation,
  SearchTextInput,
  Text,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {useNotification} from 'src/react/hooks/use-notification';
import {OnDemandReportCategory} from 'src/react/services/api-reports.enum';
import {useCustomFieldRules} from '../../custom-field-rules/custom-field-rules.queries';
import {SendReportForm} from '../../on-demand-reports/components/on-demand-report-send-report-form';
import {useCardReportsDetails, useReportDataCustom} from '../card-reports.queries';
import {onDemandReportUrls} from '../enum';
import TableReportDataMechants from './table-report-data-merchants';

const listColumnsNumber = [''];

const GiftCardTransactionsSummaryList: React.VFC = () => {
  const [showSendModal, setShowSendModal] = React.useState(false);

  const pagination = usePaginationState();
  const [{values}, {setValue}] = useFilter({
    salesTerritory: '',
    merchant: '',
    transactionDate: new Date(),
  });

  const {data: resolvedData, isFetching} = useReportDataCustom({
    url: onDemandReportUrls.GIFT_CARD_TRANSACTIONS_SUMMARY,
    category: OnDemandReportCategory.CARD,
    perPage: pagination.perPage,
    page: pagination.page,
    ...values,
  });
  const {data: reportDetails} = useCardReportsDetails(
    OnDemandReportCategory.CARD,
    onDemandReportUrls.GIFT_CARD_TRANSACTIONS_SUMMARY,
  );

  const {data: customFields} = useCustomFieldRules({
    page: 1,
    perPage: 100,
    searchValue: 'salesTerritory',
  });
  const salesTerritoryField = customFields?.items.find((f) => f.fieldName === 'salesTerritory');
  const salesTerritoryListOpt: any[] = salesTerritoryField?.valueOptions || [];
  salesTerritoryListOpt.unshift('Any');

  const data = React.useMemo(() => {
    return resolvedData && resolvedData.filter((item) => !item.exportOnly).filter(Boolean)[0];
  }, [resolvedData]);
  const summaryData = React.useMemo(() => {
    return resolvedData && resolvedData.filter((item) => !item.exportOnly).filter(Boolean)[1];
  }, [resolvedData]);

  const dismissSendModal = React.useCallback(() => {
    setShowSendModal(false);
  }, []);

  const showMessage = useNotification();

  return (
    <>
      <div className="grid gap-4 pt-6 max-w-6xl mx-auto px-4 sm:px-6 mb-15 relative">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Gift card transactions by sales territory report</h1>
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
              <Label>Sales territory</Label>
              <DropdownSelect
                placeholder={'Any'}
                options={salesTerritoryListOpt}
                value={values.salesTerritory}
                onChangeValue={(value: string) => {
                  pagination.setPage(1);
                  setValue('salesTerritory', value);
                }}
              />
            </Field>
            <Field>
              <Label>Merchant name</Label>
              <SearchTextInput
                value={values.merchant}
                onChangeValue={(value) => {
                  pagination.setPage(1);
                  setValue('merchant', value);
                }}
                placeholder="Search..."
              />
            </Field>
            <Field>
              <Label>Transaction on</Label>
              <DaySelector
                value={values.transactionDate}
                onChangeValue={(value) => {
                  setValue('transactionDate', value);
                  pagination.setPage(1);
                }}
                placeholder="Select date"
                emptyValue="Today"
                className="w-full"
              />
            </Field>
          </div>
          {!!values.merchant && !isFetching && (
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
                  <Td>SALES TERRITORY</Td>
                  <Td>MERCHANT ID</Td>
                  <Td>MERCHANT NAME</Td>
                  <Td>TOTAL EXTERNAL TOP UP AMOUNT</Td>
                  <Td>TOTAL TRANSFER (GRANT) AMOUNT</Td>
                  <Td>TOTAL TRANSFER (REVOKE) AMOUNT</Td>
                  <Td>TOTAL ADJUSTMENT (GRANT) AMOUNT</Td>
                  <Td>TOTAL ADJUSTMENT (REVOKE) AMOUNT</Td>
                  <Td>TOTAL TOP UP AMOUNT</Td>
                  <Td className="text-right">TOTAL CHARGE AMOUNT</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody"></DataTableRowGroup>
            </>
          )}
          {data && <TableReportDataMechants data={data} listColumnsNumber={listColumnsNumber} />}
        </DataTable>
      </div>
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
    </>
  );
};

export default GiftCardTransactionsSummaryList;
