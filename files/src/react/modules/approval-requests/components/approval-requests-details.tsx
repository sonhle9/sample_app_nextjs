import {
  Badge,
  BadgeProps,
  Button,
  Card,
  CardContent,
  CardHeading,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  Dialog,
  DialogContent,
  DialogFooter,
  Field,
  formatDate,
  JsonPanel,
  Text,
  PaginationNavigation,
  usePaginationState,
  Label,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from '@setel/portal-ui';
import classNames from 'classnames';
import * as React from 'react';
import {convertToSensitiveNumber} from 'src/app/cards/shared/common';
import {ColorMap} from 'src/app/cards/shared/enums';
import {useNotification} from 'src/react/hooks/use-notification';
import {useRouter} from 'src/react/routing/routing.context';
import {SubtypeMap} from 'src/shared/enums/card.enum';
import {approvalRequestRole} from 'src/shared/helpers/pdb.roles.type';
import {ISessionData} from 'src/shared/interfaces/auth.interface';
import {HasPermission} from '../../auth/HasPermission';
import {useGetCardsReference} from '../../cards/card.queries';
import {useGetTransactionWithRequestID} from '../../transactions/transaction.queries';
import {
  EApprovalRequestsFeature,
  EApprovalRequestsStatus,
  EFeatureTextPair,
} from '../approval-requests.enum';
import {
  useGetApprovalRequestDetails,
  useUpdateApprovalRequestToApprove,
  useUpdateApprovalRequestToCancel,
  useUpdateApprovalRequestToReject,
  useUpdateApprovalRequestToReturn,
} from '../approval-requests.queries';
import FleetCardReference from './fleetCard-reference';
import GiftCardOwnAdjustmentReference from './giftCard-adjustment-reference';
import GiftCardBulkTransferReference from './giftCard-bulk-transfer-reference';
import GiftCardTransferReference from './giftCard-transfer-reference';
import FleetCardMerchantReference from './fleet-card-merchant-reference';
import {FleetAccountReference} from './fleet-account-reference';
import {useGetSignedUrl} from 'src/react/modules/loyalty/loyalty.queries';
import {CreditPeriodOverrunReference} from './credit-period-overrun-reference';

interface IApprovalRequestsDetailsProps {
  id: string;
  session: ISessionData;
}

export function ApprovalRequestStatusColor(status: EApprovalRequestsStatus): BadgeProps['color'] {
  switch (status) {
    case EApprovalRequestsStatus.VERIFIED:
      return 'blue';
    case EApprovalRequestsStatus.APPROVED:
      return 'turquoise';
    case EApprovalRequestsStatus.PENDING:
      return 'lemon';
    case EApprovalRequestsStatus.REJECTED:
      return 'error';
    case EApprovalRequestsStatus.CANCELLED:
      return 'grey';
    case EApprovalRequestsStatus.FAILED:
      return 'grey';
    default:
      return 'grey';
  }
}

export const indicatorClassApprovalRequest = (status: EApprovalRequestsStatus) => {
  switch (status) {
    case EApprovalRequestsStatus.VERIFIED:
      return 'text-blue';
    default:
      return '';
  }
};

const ApprovalRequestsDetails: React.VFC<IApprovalRequestsDetailsProps> = (props) => {
  const [rejectModal, setRejectModal] = React.useState(false);
  const [approveModal, setApproveModal] = React.useState(false);
  const [cancelModal, setCancelModal] = React.useState(false);
  const [returnModal, setReturnModal] = React.useState(false);
  const setNotify = useNotification();
  const cancelRef = React.useRef(null);
  const {data, isError} = useGetApprovalRequestDetails(props.id);
  const router = useRouter();
  const [remarkApproved, setRemarkApproved] = React.useState('');
  const [remarkReturn, setRemarkReturn] = React.useState('');
  const [remarkReject, setRemarkReject] = React.useState('');
  const {mutate: updateApprovalRequestToApprove} = useUpdateApprovalRequestToApprove(props.id);
  const {mutate: updateApprovalRequestToReject} = useUpdateApprovalRequestToReject(props.id);
  const {mutate: updateApprovalRequestToCancel} = useUpdateApprovalRequestToCancel(props.id);
  const {mutate: updateApprovalRequestToReturn} = useUpdateApprovalRequestToReturn(props.id);
  const {data: signedUrl} = useGetSignedUrl(
    data?.attachments[0],
    data?.feature === EApprovalRequestsFeature.LOYALTY_ADJUSTMENT,
  );
  const {data: transactions} = useGetTransactionWithRequestID({
    requestId: data?.rawRequest?.requestId,
  });
  const pagination = usePaginationState();

  const {data: cardsCreation, isLoading} = useGetCardsReference({
    page: pagination.page,
    perPage: pagination.perPage,
    referenceRequestId: data?.rawRequest?.referenceRequestId,
  });

  React.useEffect(() => {
    if (isError) {
      router.navigateByUrl('/approval-requests');
      return;
    }
  }, [isError]);

  const fileName = React.useMemo(() => {
    return data?.attachments[0]?.split('/').pop();
  }, [data?.attachments]);
  const showBtnRejectAndApproved = React.useMemo(() => {
    return (
      [EApprovalRequestsStatus.PENDING, EApprovalRequestsStatus.VERIFIED].includes(data?.status) &&
      data.isAccess === true
    );
  }, [data]);

  const showBtnCancel = React.useMemo(() => {
    return [EApprovalRequestsStatus.PENDING, EApprovalRequestsStatus.VERIFIED].includes(
      data?.status,
    );
  }, [data]);

  const showBtnReturn = React.useMemo(() => {
    return [EApprovalRequestsStatus.VERIFIED].includes(data?.status);
  }, [data]);

  const isRequestor = React.useMemo(() => {
    return data?.createdBy === props.session.sub;
  }, [data]);

  const errorMsg = React.useMemo(() => {
    if (
      data?.status === EApprovalRequestsStatus.FAILED &&
      data?.feature === EApprovalRequestsFeature.BULKTRANSFER_CREATE
    ) {
      return 'File processed failed. Since this request has failed, please create a new request.';
    }
    return null;
  }, [data]);

  const onRejectApproval = () => {
    updateApprovalRequestToReject(
      {
        id: props.id,
        ...{remark: remarkReject},
      },
      {
        onSuccess: () => {
          setNotify({
            title: 'Success!',
            variant: 'success',
            description: 'Reject success',
          });
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          setNotify({
            title: 'Error!',
            variant: 'error',
            description: response?.message || err.message,
          });
        },
        onSettled: () => {
          setRejectModal(false);
        },
      },
    );
  };

  const onApproveHandle = () => {
    updateApprovalRequestToApprove(
      {id: props.id, ...{remark: remarkApproved}},
      {
        onSuccess: () => {
          setNotify({
            title: 'Success!',
            variant: 'success',
            description: 'Approve success',
          });
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          setNotify({
            title: 'Error!',
            variant: 'error',
            description: response?.message || err.message,
          });
        },
        onSettled: () => {
          setApproveModal(false);
        },
      },
    );
  };

  const onCancelHandle = () => {
    updateApprovalRequestToCancel(props.id, {
      onSuccess: () => {
        setNotify({
          title: 'Success!',
          variant: 'success',
          description: 'Cancel success',
        });
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setNotify({
          title: 'Error!',
          variant: 'error',
          description: response?.message || err.message,
        });
      },
      onSettled: () => {
        setCancelModal(false);
      },
    });
  };
  const onReturnHandle = () => {
    updateApprovalRequestToReturn(
      {id: props.id, ...{remark: remarkReturn}},
      {
        onSuccess: () => {
          setNotify({
            title: 'Success',
            variant: 'success',
            description: 'Return success',
          });
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          setNotify({
            title: 'Error!',
            variant: 'error',
            description: response?.message || err.message,
          });
        },
        onSettled: () => {
          setReturnModal(false);
        },
      },
    );
  };
  return (
    <>
      <HasPermission accessWith={[approvalRequestRole.read]}>
        <div className="grid gap-4 pt-8 pb-15 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approval request details</h1>
            <HasPermission accessWith={[approvalRequestRole.update]}>
              <div className="flex-row space-x-4">
                {isRequestor &&
                  (showBtnCancel ? (
                    <Button onClick={() => setCancelModal(true)} variant={'error-outline'}>
                      CANCEL
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="primary"
                      className="font-normal cursor-not-allowed"
                      onClick={() => setCancelModal(true)}>
                      CANCEL
                    </Button>
                  ))}
                {data?.isApprover && (
                  <>
                    {showBtnReturn && data.isAccess && (
                      <Button
                        disabled={!showBtnReturn}
                        className={classNames({
                          'font-normal': !showBtnReturn,
                          'cursor-not-allowed': !showBtnReturn,
                        })}
                        variant="error-outline"
                        onClick={() => setReturnModal(true)}>
                        RETURN
                      </Button>
                    )}

                    {showBtnRejectAndApproved ? (
                      <Button
                        disabled={!showBtnRejectAndApproved}
                        variant="error"
                        onClick={() => setRejectModal(true)}>
                        REJECT
                      </Button>
                    ) : (
                      <Button
                        className={classNames({
                          'font-normal': true,
                          'cursor-not-allowed': !showBtnRejectAndApproved,
                        })}
                        disabled={!showBtnRejectAndApproved}
                        variant="primary"
                        onClick={() => setRejectModal(true)}>
                        REJECT
                      </Button>
                    )}
                    <Button
                      className={classNames({
                        'font-normal': true,
                        'cursor-not-allowed': !showBtnRejectAndApproved,
                      })}
                      disabled={!showBtnRejectAndApproved}
                      variant="primary"
                      onClick={() => setApproveModal(true)}>
                      APPROVE
                    </Button>
                  </>
                )}
              </div>
            </HasPermission>
          </div>
          <Card className="mb-4">
            <CardHeading title="General" />
            <CardContent className="divide-y divide-gray-200">
              <div className="flex-1 flex-col">
                {errorMsg && <Alert variant="error" description={errorMsg} className="mb-5" />}
                <DescList className="col-span-5">
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-medium capitalize"
                    label="Status"
                    value={
                      <Badge
                        rounded="rounded"
                        color={ApprovalRequestStatusColor(data?.status)}
                        className={`uppercase ${indicatorClassApprovalRequest(data?.status)}`}>
                        {data?.status}
                      </Badge>
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Request ID"
                    value={data?.id || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Feature"
                    value={EFeatureTextPair[data?.feature] || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Amount"
                    value={<span>RM{convertToSensitiveNumber(data?.amount)}</span>}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal capitalize"
                    label="Approval level"
                    value={data?.nextLevel && `Level ${data.nextLevel}`}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Requestor user ID"
                    value={
                      data?.createdByEmail
                        ? data?.createdByEmail
                        : data?.createdBy
                        ? data?.createdBy
                        : '-'
                    }
                  />

                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Total records"
                    value={data?.totalRecords || 1}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Remarks"
                    value={data?.rawRequest?.remark || '-'}
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Attachment"
                    value={
                      fileName && (
                        <a
                          href={signedUrl ?? data.attachments[0]}
                          className="text-xs font-semibold tracking-1 focus-visible-ring text-brand-500 uppercase">
                          {data?.rawRequest?.fileName || decodeURI(fileName)}
                        </a>
                      )
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Created on"
                    value={
                      data?.createdAt &&
                      formatDate(data.createdAt, {
                        formatType: 'dateAndTime',
                      })
                    }
                  />
                  <DescItem
                    labelClassName="text-sm"
                    valueClassName="text-sm font-normal"
                    label="Last updated on"
                    value={
                      data?.updatedAt &&
                      formatDate(data.updatedAt, {
                        formatType: 'dateAndTime',
                      })
                    }
                  />
                </DescList>
              </div>
            </CardContent>
          </Card>
          {(() => {
            switch (data?.feature) {
              case EApprovalRequestsFeature.ADJUST_CREATE:
                return (
                  <GiftCardOwnAdjustmentReference
                    type={data?.rawRequest?.adjustmentType}
                    target={data?.rawRequest?.adjustmentTarget}
                    requestID={data?.rawRequest?.requestId}
                  />
                );
              case EApprovalRequestsFeature.TRANSFER_CREATE:
                return (
                  <GiftCardTransferReference
                    type={data?.rawRequest?.transferType}
                    requestID={data?.rawRequest?.requestId}
                  />
                );
              case EApprovalRequestsFeature.BULKTRANSFER_CREATE:
                return (
                  <GiftCardBulkTransferReference
                    type={data?.rawRequest?.transferType}
                    requestID={data?.rawRequest?.requestId}
                  />
                );
              case EApprovalRequestsFeature.FLEETCARDREPLACEMENT_CREATE:
                return (
                  <FleetCardReference
                    approvalRequest={data}
                    isApprover={data.isApprover}
                    isAccess={data.isAccess}
                  />
                );
              case EApprovalRequestsFeature.FLEETCARD_CREATE:
                return <FleetCardMerchantReference merchantId={data?.rawRequest?.merchantId} />;
              case EApprovalRequestsFeature.FLEET_PREPAID_ACCOUNT_CREATION:
              case EApprovalRequestsFeature.FLEET_POSTPAID_ACCOUNT_CREATION:
                return (
                  <FleetAccountReference
                    applicationId={data?.rawRequest?.applicationId}
                    requestID={data?.rawRequest?.requestId}
                  />
                );
              case EApprovalRequestsFeature.CREDIT_PERIOD_OVERRUN_CREATION:
                return (
                  <CreditPeriodOverrunReference
                    merchantId={data?.rawRequest?.merchantId}
                    requestID={data?.rawRequest?.requestId}
                    creditPeriodOverrunId={data?.rawRequest?.creditPeriodOverrunId}
                  />
                );
              default:
                return '';
            }
          })()}

          {data?.feature === EApprovalRequestsFeature.FLEETCARD_CREATE && (
            <Card className="mb-4" expandable defaultIsOpen>
              <CardHeading title="Requested card creation" />
              <DataTable
                striped
                isLoading={isLoading}
                pagination={
                  cardsCreation && (
                    <PaginationNavigation
                      total={cardsCreation.total}
                      currentPage={pagination.page}
                      perPage={pagination.perPage}
                      onChangePage={pagination.setPage}
                      onChangePageSize={pagination.setPerPage}
                    />
                  )
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td className="px-7 w-60">CARD DETAILS</Td>
                    <Td>CARD STATUS</Td>
                    <Td>CARDHOLDER NAME</Td>
                    <Td>DISPLAY NAME</Td>
                    <Td className="text-right pr-8">VEHICLE PLATE NUMBER</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {(cardsCreation?.items || []).map((card) => {
                    return (
                      <Tr key={card.id}>
                        <Td className="px-7 w-60">
                          <Text>
                            {' '}
                            {(data?.status === EApprovalRequestsStatus.APPROVED
                              ? card?.cardNumber
                              : card?.cardRange?.name) || '-'}
                          </Text>
                          <Text className={classes.bodySecondary} color="lightgrey">
                            {card?.subtype
                              ? SubtypeMap.find((subtype) => subtype.value === card.subtype)
                                  ?.label || card.subtype
                              : '-'}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            className="tracking-wider font-semibold uppercase"
                            rounded="rounded"
                            color={ColorMap[card.status]}>
                            {card.status}
                          </Badge>
                        </Td>
                        <Td>{card?.cardholder?.name || '-'}</Td>
                        <Td>{card?.cardholder?.displayName || '-'}</Td>
                        <Td className="text-right pr-8">
                          {card?.creationData?.vehicleNumber || '-'}
                        </Td>
                      </Tr>
                    );
                  })}
                </DataTableRowGroup>
                {!cardsCreation?.items?.length && (
                  <DataTableCaption>
                    <div className="w-full flex items-center justify-center py-12 text-sm">
                      You have no data to be displayed here
                    </div>
                  </DataTableCaption>
                )}
              </DataTable>
            </Card>
          )}

          <Card className={transactions?.transactions.length ? 'mb-4 mt-4' : 'mb-4'}>
            <CardHeading title="Approval history" />
            <DataTable striped>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="px-7 w-40">APPROVAL LEVEL</Td>
                  <Td>APPROVER'S EMAIL</Td>
                  <Td className="text-left">STATUS</Td>
                  <Td>REMARKS</Td>
                  <Td className="px-7 text-right">DATE</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup groupType="tbody">
                {data?.history &&
                  data.history
                    .sort((a, b) => {
                      return new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf();
                    })
                    .map((item) => {
                      return (
                        <Tr key={item.updateAt}>
                          <Td className="px-7 w-40">
                            {item.status === EApprovalRequestsStatus.PROCESSING ||
                            item.status === EApprovalRequestsStatus.APPROVED
                              ? data?.history?.find(
                                  (request) =>
                                    request.status === EApprovalRequestsStatus.PROCESSING,
                                )?.level
                              : item.level || '-'}
                          </Td>
                          <Td>{item.approverEmail}</Td>
                          <Td className="text-left">
                            <Badge
                              rounded="rounded"
                              color={ApprovalRequestStatusColor(item.status)}
                              className={`uppercase ${indicatorClassApprovalRequest(item.status)}`}>
                              {item.status}
                            </Badge>
                          </Td>
                          <Td>{item?.remark || '-'}</Td>
                          <Td className="px-7 text-right">
                            {formatDate(item.updateAt, {
                              formatType: 'dateAndTime',
                            })}
                          </Td>
                        </Tr>
                      );
                    })}
              </DataTableRowGroup>
              {data?.history && !data?.history.length && (
                <DataTableCaption>
                  <div className="w-full flex items-center justify-center py-12 text-sm">
                    There is no approval history yet.
                  </div>
                </DataTableCaption>
              )}
            </DataTable>
          </Card>
          <JsonPanel className="mb-36" json={Object.assign({...data})} />
        </div>
      </HasPermission>
      {rejectModal && (
        <Modal onDismiss={() => setRejectModal(false)} isOpen className="mt-48">
          <ModalHeader>
            <span className="text-black">Reject approval request</span>
          </ModalHeader>
          <ModalBody>
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-5">
              <Label className="pt-2">Remark</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
                <Textarea
                  value={remarkReject}
                  onChange={(e) => setRemarkReject(e.target.value)}
                  maxLength={500}
                  placeholder="State your reason(s) for rejecting this request."
                />
              </div>
            </Field>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setRejectModal(false)} ref={cancelRef}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={() => onRejectApproval()}>
                  CONFIRM
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}
      {approveModal && (
        <Modal onDismiss={() => setApproveModal(false)} isOpen className="mt-48">
          <ModalHeader>
            <span className="text-black">Approve approval request</span>
          </ModalHeader>
          <ModalBody>
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-5">
              <Label className="pt-2">Remark</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
                <Textarea
                  value={remarkApproved}
                  onChange={(e) => setRemarkApproved(e.target.value)}
                  maxLength={500}
                  placeholder="State your reason(s) for approving this request."
                />
              </div>
            </Field>
          </ModalBody>
          <ModalFooter className="text-right">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setApproveModal(false)} ref={cancelRef}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={() => onApproveHandle()}>
                  CONFIRM
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}
      {cancelModal && (
        <Dialog
          onDismiss={() => setCancelModal(false)}
          leastDestructiveRef={cancelRef}
          className="mt-48">
          <DialogContent header="Are you sure to cancel this request?">
            This action cannot be undone. Once cancelled, this request will not be able to proceed
            to the next process.
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModal(false)} ref={cancelRef}>
              NO
            </Button>
            <Button variant="error" onClick={() => onCancelHandle()}>
              YES
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      {returnModal && (
        <Modal isOpen onDismiss={() => setReturnModal(false)} className="mt-48">
          <ModalHeader>
            <span className="text-black">Return approval request</span>
          </ModalHeader>
          <ModalBody>
            <Field className="sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start mb-5">
              <Label className="pt-2">Remark</Label>
              <div className="mt-1 sm:mt-0 sm:col-span-3 text-black">
                <Textarea
                  value={remarkReturn}
                  onChange={(e) => setRemarkReturn(e.target.value)}
                  maxLength={500}
                  placeholder="State your reason(s) for returning this request."
                />
              </div>
            </Field>
          </ModalBody>
          <ModalFooter className="text right">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setReturnModal(false)} ref={cancelRef}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={() => onReturnHandle()}>
                  CONFIRM
                </Button>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export default ApprovalRequestsDetails;
