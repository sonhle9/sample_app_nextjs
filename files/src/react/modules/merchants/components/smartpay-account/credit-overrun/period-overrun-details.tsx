import * as React from 'react';
import {useCancelApprovalSPPeriodOverrun, useReadSPPeriodOverrun} from '../../../merchants.queries';
import {QueryErrorAlert} from '../../../../../components/query-error-alert';
import {
  Badge,
  Button,
  Card,
  classes,
  DescItem,
  DescList,
  formatDate,
  Modal,
} from '@setel/portal-ui';
import {getSmartpayMerchantStatusBadgeColor} from '../../../merchants.lib';
import {MerchantSmartpayStatus} from '../../../merchants.type';
import cx from 'classnames';

export const PeriodOverrunDetails = (props: {merchantId: string; periodOverrunId: string}) => {
  const {data, error, isLoading} = useReadSPPeriodOverrun(props.periodOverrunId);
  const {
    mutate: cancelApproval,
    error: cancelError,
    isLoading: cancelLoading,
  } = useCancelApprovalSPPeriodOverrun(props.merchantId, props.periodOverrunId);
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);
  const handleCancel = () => {
    cancelApproval(data.approvalRequestId, {
      onSuccess: () => setShowConfirmCancel(false),
    });
  };
  return (
    <div className={'px-20 py-10'}>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
      <div className={cx('flex justify-between mb-8', error ? 'mt-2' : '')}>
        <h1 className={classes.h1}>{'Credit period overrun details'}</h1>
        {data?.status === MerchantSmartpayStatus.PENDING &&
          data?.approvalRequestId &&
          !data.isBulkImport && (
            <Button
              onClick={() => setShowConfirmCancel(true)}
              variant={'error-outline'}
              className={'float-right'}>
              CANCEL
            </Button>
          )}
      </div>
      <Card loading={isLoading}>
        <Card.Heading title={'General'} />
        <Card.Content>
          <DescList>
            <DescItem
              label={'Merchant status'}
              value={
                <Badge
                  color={getSmartpayMerchantStatusBadgeColor(data?.merchantStatus || '')}
                  className={'uppercase'}>
                  {data?.merchantStatus}
                </Badge>
              }
            />
            <DescItem
              label={'Approve status'}
              value={
                <Badge
                  color={getSmartpayMerchantStatusBadgeColor(data?.status || '')}
                  className={'uppercase'}>
                  {data?.status}
                </Badge>
              }
            />
            <DescItem
              label={'Period'}
              value={
                data?.startDate && data?.endDate ? (
                  <>
                    {formatDate(data.startDate, {formatType: 'dateOnly'})}
                    {' - '}
                    {formatDate(data.endDate, {formatType: 'dateOnly'})}
                  </>
                ) : (
                  ''
                )
              }
            />
            <DescItem label={'Remarks'} value={data?.remark || '-'} />
            <DescItem label={'Created by'} value={data?.createdBy || '-'} />
            <DescItem
              label={'Created on'}
              value={data?.createdAt ? formatDate(data.createdAt, {formatType: 'dateOnly'}) : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      {showConfirmCancel && (
        <Modal
          size={'small'}
          isOpen
          onDismiss={() => setShowConfirmCancel(false)}
          aria-label={'confirm-cancel-approval-period-overrun'}>
          <Modal.Header>Are you sure you want to cancel?</Modal.Header>
          <Modal.Body>
            {!cancelLoading && cancelError && <QueryErrorAlert error={cancelError as any} />}
            This action cannot be undone. Once cancelled, this request will not be able to proceed
            to the next process.
          </Modal.Body>
          <Modal.Footer className={'text-right space-x-3'}>
            <Button variant="outline" onClick={() => setShowConfirmCancel(false)}>
              GO BACK
            </Button>
            <Button variant="error" onClick={handleCancel} isLoading={cancelLoading}>
              CONFIRM
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};
