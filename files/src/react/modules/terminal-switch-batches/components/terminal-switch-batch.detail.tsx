import {
  Alert,
  Badge,
  Button,
  Card,
  classes,
  DescList,
  formatDate,
  formatMoney,
  Text,
} from '@setel/portal-ui';
import _ from 'lodash';
import React from 'react';
import {SkeletonDescItem} from 'src/react/components/skeleton-display';
import {AcquirerType2Text, CardBrand2Text} from '../constant';
import {useTerminalSwitchBatchDetail} from '../terminal-switch-batch.query';
import {TerminalSwitchBatchCardTimeline} from './terminal-switch-batch.card-timeline';
import {BatchStatusColorMapping} from './constant';
import {TerminalSwitchBatchModal} from './terminal-switch-batch.modal';
import {ForceCloseRequestType} from '../terminal-switch-batches.type';
import {useNotification} from 'src/react/hooks/use-notification';
import {useHasPermission} from '../../auth';
import {terminalSwitchRoles} from 'src/shared/helpers/roles.type';

export const TerminalSwitchBatchDetail = ({
  batchId,
  isForceClose = false,
}: {
  batchId: string;
  isForceClose?: boolean;
}) => {
  const {data, isError, isLoading} = useTerminalSwitchBatchDetail({batchId});
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [typeForceClose, setTypeForceClose] = React.useState<ForceCloseRequestType>('request');

  const hasRequestForceClosePermission = useHasPermission([
    terminalSwitchRoles.force_close_approval_request,
  ]);
  const hasConfirmForceClosePermission = useHasPermission([
    terminalSwitchRoles.force_close_approval_confirm,
  ]);

  const showMessage = useNotification();

  if (isError) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }
  const dateDiff =
    (new Date().getTime() - new Date(data?.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const openDay = Math.max(Math.round(dateDiff), 0).toString();
  const batchesTitle = `${data?.batchNum} - ${AcquirerType2Text[data?.acquirerType]}`;

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <h1 className={`${classes.h2} self-center`} style={{color: '#2D333A'}}>
            {isForceClose ? 'Force close approval details' : batchesTitle}
          </h1>

          {!isLoading &&
            !isError &&
            (isForceClose ? (
              <div className="flex flex-wrap items-center space-x-2">
                {data.canRejectForceClose && (
                  <Button
                    data-testid="force-close-approval-generate-button-reject"
                    variant="error"
                    disabled={!hasConfirmForceClosePermission}
                    onClick={() => {
                      setVisibleModal(true);
                      setTypeForceClose('reject');
                    }}>
                    REJECT
                  </Button>
                )}
                {data.canApproveForceClose && (
                  <Button
                    data-testid="force-close-approval-generate-button-approve"
                    variant="primary"
                    disabled={!hasConfirmForceClosePermission}
                    onClick={() => {
                      setVisibleModal(true);
                      setTypeForceClose('approve');
                    }}>
                    APPROVE
                  </Button>
                )}
              </div>
            ) : (
              data.canRequestForceClose && (
                <Button
                  data-testid="force-close-approval-generate-button-request"
                  variant="primary"
                  disabled={!hasRequestForceClosePermission}
                  onClick={() => {
                    setVisibleModal(true);
                    setTypeForceClose('request');
                  }}>
                  FORCE CLOSE
                </Button>
              )
            ))}
        </div>
        <Card>
          <Card.Heading title="General"></Card.Heading>
          <Card.Content className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              GENERAL
            </Text>
            <DescList isLoading={isLoading}>
              <SkeletonDescItem
                isLoading={isLoading}
                label="Status"
                value={
                  data && (
                    <Badge rounded="rounded" color={BatchStatusColorMapping[data.status]}>
                      {data.status}
                    </Badge>
                  )
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Merchant ID"
                value={data?.merchantId ? data.merchantId : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Merchant name"
                value={data?.merchantName ? data.merchantName : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Terminal ID"
                value={data?.terminalId ? data.terminalId : '-'}
              />
              <SkeletonDescItem isLoading={isLoading} label="Settlement ID" value={'-'} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Created date"
                value={
                  data?.createdAt ? formatDate(data.createdAt, {formatType: 'dateAndTime'}) : '-'
                }
              />
            </DescList>
          </Card.Content>
          <Card.Content className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              DETAILS
            </Text>
            <DescList isLoading={isLoading}>
              <SkeletonDescItem
                isLoading={isLoading}
                label="Batch number"
                value={data?.batchNum ? data.batchNum : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Acquirer Type"
                value={data?.acquirerType ? AcquirerType2Text[data.acquirerType] : '-'}
              />
              <SkeletonDescItem
                className="w-12"
                isLoading={isLoading}
                label="Card Type"
                value={
                  data?.cardBrands
                    ? data.cardBrands
                        .map((cardBrand) => {
                          return CardBrand2Text[cardBrand];
                        })
                        .join(', ')
                    : '-'
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total sales count"
                value={!_.isUndefined(data?.saleCount) ? data.saleCount.toString() : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total sales amount"
                value={`RM${!_.isUndefined(data?.saleAmount) ? formatMoney(data.saleAmount) : '-'}`}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total top-up count"
                value={!_.isUndefined(data?.topupCount) ? data.topupCount.toString() : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total top-up amount"
                value={`RM${
                  !_.isUndefined(data?.topupAmount) ? formatMoney(data.topupAmount) : '-'
                }`}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total point count"
                value={!_.isUndefined(data?.pointCount) ? data.pointCount.toString() : '-'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Total point amount"
                value={`RM${
                  !_.isUndefined(data?.pointAmount) ? formatMoney(data.pointAmount) : '-'
                }`}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Open days count"
                value={`${openDay ? openDay : '-'} days`}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="First transaction date"
                value={
                  data?.firstTxAt ? formatDate(data.firstTxAt, {formatType: 'dateAndTime'}) : '-'
                }
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Last transaction date"
                value={
                  data?.lastTxAt ? formatDate(data.lastTxAt, {formatType: 'dateAndTime'}) : '-'
                }
              />
            </DescList>
          </Card.Content>
        </Card>

        {data?.forceClose?.timeline?.length > 0 && (
          <TerminalSwitchBatchCardTimeline
            timelines={data?.forceClose?.timeline}
            className="my-8"
          />
        )}

        <TerminalSwitchBatchModal
          batchId={batchId}
          visible={visibleModal}
          typeForceClose={typeForceClose}
          onClose={() => {
            setVisibleModal(false);
          }}
          onSuccessUpdate={(title) => showMessage({title})}
        />
      </div>
    </>
  );
};
