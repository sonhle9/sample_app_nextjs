import {
  Alert,
  AlertMessages,
  Button,
  Card,
  CardHeading,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  DateRangeDropdown,
  FieldContainer,
  Notification,
  PaginationNavigation,
  SearchableNestedMultiSelect,
  TextField,
  usePaginationState,
  useTransientState,
} from '@setel/portal-ui';
import {Form, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {useRouter} from 'src/react/routing/routing.context';
import {terminalSwitchRoles} from 'src/shared/helpers/roles.type';
import {useHasPermission} from '../../auth';
import {CARD_OPTIONS_NAME} from '../../terminal-switch-monthly-card-sales-report/constant';
import {PaymentIconMapping} from '../../terminal-switch-transactions/constant';
import {DATE_RANGE_OPTIONS_WITHOUT_ANY, DEFAULT_COL_CLASSNAME} from '../constant';
import {useGetMerchants, useTxNBatchSummaryLazy} from '../terminal-switch-tx-n-batch-summary.query';
import {validationTxNBatchListingSchema} from '../terminal-switch-tx-n-batch-summary.schema';
import {
  downloadTerminalSwitchTxNBatchSummary,
  sentTerminalTxNBatchSummaryBatchesViaEmail,
} from '../terminal-switch-tx-n-batch-summary.service';
import {ITxNBatchSummaryResponseDto} from '../terminal-switch-tx-n-batch-summary.type';

export const TerminalSwitchTxNBatchSummaryListing = () => {
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});
  const [requestFilter, setRequestFilter] = useState(null);
  const initialValues = {
    dateRange: ['', ''] as [string, string],
    terminalId: '',
    batchNum: '',
    merchantIds: [],
  };
  const router = useRouter();

  const hasReadTransactionNBatch = useHasPermission([
    terminalSwitchRoles.transaction_and_batch_summary_report,
  ]);

  useEffect(() => {
    if (!hasReadTransactionNBatch) {
      router.navigateByUrl('/landing-dashboard');
    }
  }, [hasReadTransactionNBatch]);

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);

  // Pagination
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });

  const handleChangePage = (page: number) => {
    mutate({...requestFilter, page, perPage});
    setPage(page);
  };

  const handleChangePerPage = (perPage: number) => {
    mutate({...requestFilter, page, perPage});
    setPerPage(perPage);
  };

  // Fetch data
  const {data, isError, mutate, isLoading, isSuccess} = useTxNBatchSummaryLazy({
    onError: (e) => {
      const errorMessage = e.response?.data?.message;
      setErrorMessage([errorMessage].flat());
    },
    onSuccess: async (_, variables) => {
      setRequestFilter(variables);
    },
  });

  const isEmptySwitchBatchesList = data?.txNBatchSummary?.length === 0 ?? true;

  const downloadCsv = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilter;
    return downloadTerminalSwitchTxNBatchSummary(rest);
  }, [requestFilter]);

  const sendEmailCsv = React.useCallback(
    async (email: string[]) => {
      const {page, perPage, ...rest} = requestFilter;
      await sentTerminalTxNBatchSummaryBatchesViaEmail(email, rest)
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

  const handleSubmit = async ({values}) => {
    mutate({
      merchantIds: values.merchantIds.map((merchant) => merchant.value),
      terminalId: values.terminalId,
      batchNum: values.batchNum,
      from: values.dateRange[0],
      to: values.dateRange[1],
      page: 1,
      perPage,
    });
    setPage(1);
  };

  const mapSwitchBatchToRow = (batch: ITxNBatchSummaryResponseDto, index: number) => {
    const {
      merchantId,
      terminalId,
      acquirer,
      merchantName,
      createdDateTxt,
      createdTimeTxt,
      stan,
      batchNum,
      cardTypeTxt,
      mti,
      terminalTypeTxt,
      card,
      amountTxt,
      referenceId,
      authNum,
    } = batch;

    const brand = card?.brand;
    const brandLogoUrl = PaymentIconMapping[brand];

    return (
      <DataTableRow key={index} className="flex">
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{merchantId}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{terminalId}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{acquirer?.merchantId}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{acquirer?.terminalId}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME} w-72`}>{merchantName}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{createdDateTxt}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{createdTimeTxt}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{stan}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{batchNum}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>
          <div className="h-8 flex space-x-2 items-center">
            <img src={brandLogoUrl} className="h-8" />
            <div>{CARD_OPTIONS_NAME[cardTypeTxt]}</div>
          </div>
        </DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{mti}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{terminalTypeTxt}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{card?.maskedPan}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{amountTxt}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>{referenceId}</DataTableCell>
        <DataTableCell className={`${DEFAULT_COL_CLASSNAME} text-right`}>{authNum}</DataTableCell>
      </DataTableRow>
    );
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <div className="self-center">
            <h1 className={`${classes.h1}`}>Transaction and batch summary report</h1>
          </div>

          {!isLoading && !isError && !isEmptySwitchBatchesList && (
            <div className="flex flex-wrap items-center space-x-2">
              <DownloadCsvDropdown
                variant="outline"
                emailModalTitle="Send email"
                onDownload={downloadCsv}
                onSendEmail={sendEmailCsv}
                disabled={!isSuccess}
              />
            </div>
          )}
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}

        <Card>
          <Card.Heading title="Generate report" />
          <Card.Content>
            <Alert
              className="mb-7"
              variant="info"
              description="Kindly click on the Generate button to generate the reports."
            />
            <Formik
              initialValues={initialValues}
              validationSchema={validationTxNBatchListingSchema}
              onSubmit={async (values) => handleSubmit({values})}>
              {({values, errors, isSubmitting, setFieldValue, submitForm}) => (
                <div data-testid="tx-n-batch-listing-form">
                  {errorMessage.length > 0 && (
                    <Alert className="mb-2" variant="error" description="Wrong validation">
                      <AlertMessages messages={errorMessage} />
                    </Alert>
                  )}
                  <FieldContainer
                    status={errors.dateRange ? 'error' : undefined}
                    helpText={errors.dateRange ? 'This field is mandatory' : undefined}
                    label={
                      <div className="mb-5">
                        <p>Created on</p>
                        <p>(required)</p>
                      </div>
                    }
                    layout="horizontal-responsive"
                    labelAlign="center">
                    <DateRangeDropdown
                      value={values.dateRange}
                      name="dateRange"
                      onChangeValue={(value) => setFieldValue('dateRange', value)}
                      className="w-1/3"
                      dayOnly
                      options={DATE_RANGE_OPTIONS_WITHOUT_ANY}
                      placeholder="Any dates"
                    />
                  </FieldContainer>
                  <Form>
                    <FieldContainer
                      label={<p className="mb-5">Terminal ID</p>}
                      layout="horizontal-responsive"
                      labelAlign="center">
                      <TextField
                        value={values.terminalId}
                        name="terminalId"
                        onChangeValue={(value) => setFieldValue('terminalId', value)}
                        placeholder="Any terminal ID"
                        className="w-1/3"
                      />
                    </FieldContainer>
                    <FieldContainer
                      label={<p className="mb-5">Batch ID</p>}
                      layout="horizontal-responsive"
                      labelAlign="center">
                      <TextField
                        value={values.batchNum}
                        name="batchNum"
                        onChangeValue={(value) => setFieldValue('batchNum', value)}
                        placeholder="Any batch ID"
                        className="w-1/3"
                      />
                    </FieldContainer>
                    <FieldContainer
                      label="Merchant"
                      layout="horizontal-responsive"
                      labelAlign="center">
                      <SearchableNestedMultiSelect
                        values={values.merchantIds}
                        onInputValueChange={setMerchantSearchValue}
                        onChangeValues={(values) => setFieldValue('merchantIds', values)}
                        options={merchants}
                        className="w-2/3"
                        placeholder="Search by Merchant Name / ID"
                      />
                    </FieldContainer>
                    <div className="text-right">
                      <Button
                        variant="primary"
                        type="submit"
                        onSubmit={submitForm}
                        disabled={
                          !validationTxNBatchListingSchema.isValidSync(values) || isSubmitting
                        }>
                        GENERATE REPORT
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </Card.Content>
        </Card>

        {isSuccess && (
          <DataTable
            isLoading={isLoading}
            striped
            pagination={
              <PaginationNavigation
                total={data && data.total}
                currentPage={page}
                perPage={perPage}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePerPage}
              />
            }
            heading={<CardHeading title="Reports result" />}>
            <DataTableRowGroup groupType="thead">
              <DataTableRow className="flex">
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>MERCHANT ID</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>TERMINAL ID</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>FI MERCHANT ID</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>FI Terminal ID</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME} w-72`}>
                  MERCHANT NAME
                </DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>DATE</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>TIME</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>TRACE</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>BATCH ID</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>CARD TYPE</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>MTI </DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>TERMINAL TYPE</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>CARD NUMBER</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>AMOUNT</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME}`}>REF NUMBER</DataTableCell>
                <DataTableCell className={`${DEFAULT_COL_CLASSNAME} w-72 text-right`}>
                  AUTH NUMBER
                </DataTableCell>
              </DataTableRow>
            </DataTableRowGroup>
            <DataTableRowGroup groupType="tbody">
              {!isLoading &&
                !isEmptySwitchBatchesList &&
                data?.txNBatchSummary?.map(mapSwitchBatchToRow)}
            </DataTableRowGroup>
            <DataTableCaption>
              {!isLoading && isEmptySwitchBatchesList && (
                <div className="py-12">
                  <p className="text-center text-gray-400 text-sm">No Batch was found</p>
                </div>
              )}
            </DataTableCaption>
            <Notification
              isShow={showNoti}
              variant={notiType}
              title={
                notiType === 'success'
                  ? 'Request successfully. The csv will be sent shortly.'
                  : 'Fail to request.'
              }
            />
          </DataTable>
        )}
      </div>
      {isLoading && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
