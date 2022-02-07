import * as React from 'react';
import {useEffect} from 'react';
import {
  Alert,
  Badge,
  BareButton,
  Button,
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup as Tg,
  DaySelector,
  DescItem,
  DescList,
  EditIcon,
  FieldContainer,
  formatDate,
  Modal,
  MoneyInput,
  Pagination,
  PlusIcon,
  Tabs,
} from '@setel/portal-ui';
import {
  merchantQueryKey,
  useDeleteSPBalancesTempoCreditLimit,
  useSPBalancesTempoCreditLimit,
  useSPBalanceSummary,
  useUpdateSPBalancesTempoCreditLimit,
} from '../../merchants.queries';
import {
  FleetPlan,
  FleetTransactionTypesOptions,
  SmartpayBalanceSummary,
  SmartpayBalanceTempoCreditLimit,
} from '../../merchants.type';
import {formatMoney} from '@setel/web-utils';
import {useFormik} from 'formik';
import {SmartpayBalanceTempoCreditLimitSchema} from './smartpay-validation-schema';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useNotification} from '../../../../hooks/use-notification';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {getSPBalanceTransactions} from '../../merchants.service';
import {getFleetTransStatusBadgeColor, getOptionLabel} from '../../merchants.lib';

export const SmartpayDetailsBalances = (props: {fleetPlan: string; merchantId: string}) => {
  const {
    data: tempoLimit,
    isLoading: tempoLimitLoading,
    error: tempoLimitError,
  } = useSPBalancesTempoCreditLimit(props.merchantId);

  const {
    data: summaryBalance,
    isLoading: summaryBalanceLoading,
    error: summaryBalanceError,
  } = useSPBalanceSummary(props.merchantId);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const showMessage = useNotification();

  const isPostpaid = props.fleetPlan === FleetPlan.POSTPAID;

  const loading = tempoLimitLoading || summaryBalanceLoading;

  return (
    <>
      <Card loading={loading}>
        <Card.Heading title={'General'}>
          {isPostpaid && tempoLimit && summaryBalance && (
            <Button
              className={'ml-3 pu-min-w-20'}
              leftIcon={<EditIcon />}
              variant={'outline'}
              onClick={() => setShowEditModal(true)}>
              EDIT
            </Button>
          )}
          {showEditModal && (
            <EditBalanceModal
              summary={summaryBalance}
              tempoCreditLimit={tempoLimit}
              isPostpaid={isPostpaid}
              merchantId={props.merchantId}
              onDone={(msg: string) => {
                setShowEditModal(false);
                showMessage({
                  title: 'Success!',
                  description: msg,
                });
              }}
              isMerchantView={!!props.merchantId}
              onDismiss={() => setShowEditModal(false)}
            />
          )}
        </Card.Heading>
        <Tabs>
          <Tabs.TabList>
            <Tabs.Tab label={'Summary'} />
            {isPostpaid && <Tabs.Tab label={'Temporary credit limit'} />}
          </Tabs.TabList>
          <Tabs.Panels>
            <Tabs.Panel className={'p-7'}>
              {summaryBalanceError && !summaryBalanceLoading && (
                <QueryErrorAlert error={summaryBalanceError as any} />
              )}
              <DescList>
                <DescItem
                  label={
                    <span>
                      Approved credit
                      <br />
                      limit
                    </span>
                  }
                  value={
                    summaryBalance
                      ? `RM ${formatMoney(summaryBalance.approvedCreditLimit || 0)}`
                      : '-'
                  }
                />
                <DescItem
                  label={'Total credit limit'}
                  value={
                    summaryBalance ? `RM ${formatMoney(summaryBalance.totalCreditLimit || 0)}` : '-'
                  }
                />
                <DescItem
                  label={
                    <span>
                      Total transaction
                      <br />
                      amount
                    </span>
                  }
                  value={summaryBalance ? `RM ${formatMoney(summaryBalance.txsAmount || 0)}` : '-'}
                />
                <DescItem
                  label={
                    <span>
                      Total available
                      <br />
                      balance
                    </span>
                  }
                  value={
                    summaryBalance ? `RM ${formatMoney(summaryBalance.availableBalance || 0)}` : '-'
                  }
                />
              </DescList>
            </Tabs.Panel>
            {isPostpaid && (
              <Tabs.Panel className={'p-7 text-sm'}>
                {tempoLimitError && !tempoLimitLoading && (
                  <QueryErrorAlert error={tempoLimitError as any} />
                )}
                {!tempoLimitError && (
                  <>
                    {tempoLimit?.amount === null && !tempoLimitLoading && (
                      <span>No temporary credit limit has been set</span>
                    )}
                    {tempoLimit?.amount !== null && !tempoLimitLoading && (
                      <DescList isLoading={tempoLimitLoading}>
                        <DescItem
                          label={'Amount'}
                          value={tempoLimit?.amount ? `RM ${formatMoney(tempoLimit.amount)}` : '-'}
                        />
                        <DescItem
                          label={'Effective date'}
                          value={
                            tempoLimit?.startDate && tempoLimit?.endDate
                              ? `${formatDate(tempoLimit.startDate, {
                                  formatType: 'dateOnly',
                                })} - ${formatDate(tempoLimit.endDate, {formatType: 'dateOnly'})}`
                              : '-'
                          }
                        />
                        <DescItem
                          label={'Created on'}
                          value={tempoLimit?.createdAt ? formatDate(tempoLimit.createdAt) : '-'}
                        />
                      </DescList>
                    )}
                  </>
                )}
              </Tabs.Panel>
            )}
          </Tabs.Panels>
        </Tabs>
      </Card>
      <SmartpayBalanceTransaction merchantId={props.merchantId} />
    </>
  );
};

const EditBalanceModal = (props: {
  onDismiss: () => void;
  onDone: (msg: string) => void;
  merchantId: string;
  tempoCreditLimit: SmartpayBalanceTempoCreditLimit;
  isMerchantView: boolean;
  isPostpaid: boolean;
  summary: SmartpayBalanceSummary;
}) => {
  const {
    mutate: updateBalanceTempoCreditLimit,
    error: updateError,
    isLoading: updateLoading,
  } = useUpdateSPBalancesTempoCreditLimit(props.merchantId);

  const {
    mutate: deleteBalanceTempoCreditLimit,
    error: deleteError,
    isLoading: deleteLoading,
  } = useDeleteSPBalancesTempoCreditLimit(props.merchantId);

  const tempoCreditLimit = props.tempoCreditLimit;
  const yesterday = new Date(new Date().getTime() - 86400000);

  const isNoTempoSet = tempoCreditLimit.amount === null;

  const {setFieldValue, setValues, handleSubmit, values, touched, errors, handleBlur, dirty} =
    useFormik({
      initialValues: {
        amount: `${isNoTempoSet ? '' : tempoCreditLimit.amount}`,
        startDate: tempoCreditLimit.startDate ? new Date(tempoCreditLimit.startDate) : undefined,
        endDate: tempoCreditLimit.endDate ? new Date(tempoCreditLimit.endDate) : undefined,
        totalCreditLimit: props.summary.totalCreditLimit || null,
        availableBalance: props.summary.approvedCreditLimit || null,
      },
      onSubmit: () => {
        if (!isNoTempoSet && !showTempoLimit) {
          deleteBalanceTempoCreditLimit(null, {
            onSuccess: () =>
              props.onDone('You have successfully deleted your temporary credit limit'),
          });
        } else if (dirty) {
          updateBalanceTempoCreditLimit(
            {
              ...(tempoCreditLimit.id && {
                id: tempoCreditLimit.id,
              }),
              amount: Number(values.amount),
              startDate: formatDate(values.startDate, {format: 'yyyy-MM-dd'}),
              endDate: formatDate(values.endDate, {format: 'yyyy-MM-dd'}),
            },
            {
              onSuccess: () =>
                props.onDone('You have successfully added your temporary credit limit'),
            },
          );
        } else {
          props.onDismiss();
        }
      },
      validationSchema: SmartpayBalanceTempoCreditLimitSchema,
    });

  useEffect(() => {
    if (values.startDate && values.endDate) {
      const startTime = values.startDate.getTime();
      const endTime = values.endDate.getTime();
      if (startTime > endTime) {
        setFieldValue('endDate', undefined);
      }
    }
  }, [values]);

  const [showTempoLimit, setShowTempoLimit] = React.useState(!isNoTempoSet);
  useEffect(() => {
    const now = Date.now() + 43200000;
    const startTime = values.startDate?.getTime();
    const endTime = values.endDate?.getTime();

    if (!showTempoLimit) {
      setValues({
        ...values,
        totalCreditLimit: props.summary.approvedCreditLimit,
        availableBalance: props.summary.approvedCreditLimit - props.summary.txsAmount,
      });
    } else if ((!startTime && !endTime) || (startTime <= now && now <= endTime)) {
      setValues({
        ...values,
        totalCreditLimit: props.summary.approvedCreditLimit + Number.parseFloat(values.amount),
        availableBalance:
          props.summary.approvedCreditLimit +
          Number.parseFloat(values.amount) -
          props.summary.txsAmount,
      });
    } else {
      setValues({
        ...values,
        totalCreditLimit: props.summary.approvedCreditLimit,
        availableBalance: props.summary.approvedCreditLimit - props.summary.txsAmount,
      });
    }
  }, [values.amount, values.startDate, values.endDate, showTempoLimit]);

  const isLoading = updateLoading || deleteLoading;
  const error = updateError || deleteError;

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'edit-company-modal'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if ((!showTempoLimit && !isNoTempoSet) || showTempoLimit || dirty) {
            handleSubmit();
          } else {
            props.onDismiss();
          }
        }}>
        <Modal.Header>Edit details</Modal.Header>
        <Tabs>
          {!isLoading && error && <QueryErrorAlert error={error as any} />}
          <Tabs.TabList>
            <Tabs.Tab label={'Summary'} />
            {props.isPostpaid && <Tabs.Tab label={'Temporary credit limit'} />}
          </Tabs.TabList>
          <Tabs.Panels className={'p-7'}>
            <Tabs.Panel>
              <FieldContainer
                layout={'horizontal-responsive'}
                label={
                  <span>
                    Approved credit
                    <br />
                    limit
                  </span>
                }>
                <MoneyInput
                  className={'w-48'}
                  value={formatMoney(props.summary.approvedCreditLimit || 0)}
                  disabled
                />
              </FieldContainer>
              <FieldContainer
                layout={'horizontal-responsive'}
                label={<span>Total credit limit</span>}>
                <MoneyInput
                  className={'w-48'}
                  value={formatMoney(values.totalCreditLimit || 0)}
                  disabled
                />
              </FieldContainer>
              <FieldContainer
                layout={'horizontal-responsive'}
                label={
                  <span>
                    Total transaction
                    <br />
                    amount
                  </span>
                }>
                <MoneyInput
                  className={'w-48'}
                  value={formatMoney(props.summary.txsAmount || 0)}
                  disabled
                />
              </FieldContainer>
              <FieldContainer
                layout={'horizontal-responsive'}
                label={
                  <span>
                    Total available
                    <br />
                    balance
                  </span>
                }>
                <MoneyInput
                  className={'w-48'}
                  value={formatMoney(values.availableBalance || 0)}
                  disabled
                />
              </FieldContainer>
            </Tabs.Panel>
            {props.isPostpaid && (
              <Tabs.Panel>
                {showTempoLimit ? (
                  <>
                    <FieldContainer
                      layout={'horizontal-responsive'}
                      label={
                        <span>
                          Amount <span className={'text-error'}>*</span>
                        </span>
                      }
                      status={touched.amount && errors.amount ? 'error' : undefined}
                      helpText={touched.amount && errors.amount ? errors.amount : undefined}
                      className={'relative'}>
                      <MoneyInput
                        name={'amount'}
                        onBlur={handleBlur}
                        value={values.amount}
                        onChangeValue={(newValue) => setFieldValue('amount', newValue)}
                      />
                      <BareButton
                        className={'text-error absolute top-0 right-0'}
                        onClick={() => {
                          setShowTempoLimit(false);
                        }}>
                        REMOVE
                      </BareButton>
                    </FieldContainer>
                    <FieldContainer
                      layout={'horizontal-responsive'}
                      label={
                        <span>
                          Effective date <span className={'text-error'}>*</span>
                        </span>
                      }>
                      <div className={'inline-flex'}>
                        <FieldContainer
                          className={'mb-0'}
                          status={errors.startDate && touched.startDate ? 'error' : undefined}
                          helpText={errors.startDate && touched.startDate ? errors.startDate : ''}>
                          <DaySelector
                            showMonthYearDropdown
                            name="startDate"
                            className={'w-36'}
                            onBlur={handleBlur}
                            value={values.startDate}
                            onChangeValue={(val) => setFieldValue('startDate', val)}
                            minDate={yesterday}
                          />
                        </FieldContainer>
                        <span className={'mx-4 pt-2'}>—</span>
                        <FieldContainer
                          className={'mb-0'}
                          status={errors.endDate && touched.endDate ? 'error' : undefined}
                          helpText={errors.endDate && touched.endDate ? errors.endDate : ''}>
                          <DaySelector
                            showMonthYearDropdown
                            name="endDate"
                            className={'w-36'}
                            onBlur={handleBlur}
                            value={values.endDate}
                            onChangeValue={(val) => setFieldValue('endDate', val)}
                            minDate={
                              values.startDate
                                ? new Date(values.startDate.getTime() - 86400000)
                                : yesterday
                            }
                          />
                        </FieldContainer>
                      </div>
                    </FieldContainer>
                    <span className={'text-xs text-gray-600'}>
                      <span className={'text-error'}>*</span> Required fields
                    </span>
                  </>
                ) : (
                  <>
                    <Alert
                      variant="info"
                      className={'mb-6'}
                      description="No temporary credit limit has been set"
                    />
                    <div
                      style={{letterSpacing: '1px'}}
                      className={'mb-6 flex cursor-pointer text-brand-500 text-xs font-bold'}
                      onClick={() => setShowTempoLimit(true)}>
                      <PlusIcon className={'w-4 h-4 mr-1'} />
                      <span className={'pt-px'}>TEMPORARY CREDIT LIMIT</span>
                    </div>
                  </>
                )}
              </Tabs.Panel>
            )}
          </Tabs.Panels>
        </Tabs>
        <Modal.Footer className={'text-right space-x-3'}>
          <Button variant="outline" onClick={props.onDismiss}>
            CANCEL
          </Button>
          <Button variant="primary" type={'submit'} isLoading={isLoading}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const SmartpayBalanceTransaction = (props: {merchantId: string}) => {
  const {
    query: {data, isLoading, isFetching, error},
    pagination,
  } = useDataTableState({
    initialFilter: null,
    queryKey: merchantQueryKey.smartpayBalanceTrans,
    queryFn: (currentValues) => getSPBalanceTransactions(props.merchantId, currentValues),
  });

  return (
    <Card className={'mt-8'}>
      <Card.Heading title={'Transactions'} />
      <Card.Content className={'p-0'}>
        {error && !isLoading && <QueryErrorAlert error={error as any} />}
        <DataTable
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data && (
              <Pagination
                currentPage={data.metadata.currentPage}
                pageSize={pagination.perPage}
                onChangePageSize={pagination.setPerPage}
                onChangePage={pagination.setPage}
                lastPage={data.metadata.lastPage}
                hideIfSinglePage
                onGoToLast={() => {
                  pagination.setIsLastPage(true);
                }}
              />
            )
          }>
          <Tg groupType={'thead'}>
            <Tr>
              <Td className={'pl-7 text-right w-40'}>Amount (RM)</Td>
              <Td>Status</Td>
              <Td>Type</Td>
              <Td className={'text-right'}>Created on</Td>
            </Tr>
          </Tg>
          <Tg>
            {data?.items.map((trans) => (
              <Tr key={trans.id}>
                <Td className={'pl-7 text-right w-40'}>{formatMoney(trans.amount)}</Td>
                <Td>
                  {
                    <Badge
                      color={getFleetTransStatusBadgeColor(trans.status)}
                      className={'uppercase'}>
                      {trans.status}
                    </Badge>
                  }
                </Td>
                <Td>{getOptionLabel(FleetTransactionTypesOptions, trans.type)}</Td>
                <Td className={'text-right'}>{formatDate(trans.createdAt)}</Td>
              </Tr>
            ))}
          </Tg>
          {data?.items.length === 0 && (
            <DataTableCaption>
              <div className="w-full flex items-center justify-center py-9 text-sm text-gray-400">
                You have no data to be displayed here
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </Card.Content>
    </Card>
  );
};
