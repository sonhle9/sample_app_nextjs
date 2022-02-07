import {
  Alert,
  Badge,
  BadgeProps,
  Card,
  CardHeading,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  DescList,
  formatDate,
  JsonPanel,
  Skeleton,
  Text,
  Timeline,
  TimelineItemProps,
} from '@setel/portal-ui';
import _, {capitalize} from 'lodash';
import React from 'react';
import {SkeletonDescItem} from 'src/react/components/skeleton-display';
import {ItemisedDetails} from '../../transactions/transaction.type';
import {PaymentPrettyTextMapping, TerminalSwitchTransactionStatusMapColor} from '../constant';
import {useSwitchTransactionDetail} from '../terminal-switch-transaction.query';
import {
  TerminalSwitchTransactionStatus,
  TerminalSwitchTransactionType,
  Timeline as TransactionTimeline,
} from '../terminal-switch-transaction.type';

interface ISwitchTransactionDetailProps {
  transactionId: string;
  onCompletedDisplayedPanCalc: (displayedPan: string) => void;
}

export const TerminalSwitchTransactionDetail = ({
  transactionId,
  onCompletedDisplayedPanCalc,
}: ISwitchTransactionDetailProps) => {
  const {data, isLoading, isError} = useSwitchTransactionDetail({transactionId});

  if (isError) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }

  const card = data?.card;
  let brand = card?.brand;
  let displayedPan = card?.maskedPan;
  if (!!card?.fullPan) {
    displayedPan = card?.fullPan;
  }

  onCompletedDisplayedPanCalc(displayedPan);

  const mappingTimelineItem = (timeline: TransactionTimeline, index: number) => {
    const title = capitalize(timeline.status);
    const description =
      timeline.date &&
      formatDate(timeline.date, {
        formatType: 'dateAndTime',
      });
    const color = TerminalSwitchTransactionStatusMapColor[
      timeline.status
    ] as TimelineItemProps['color'];
    const titleHtml = <div className="text-sm">{`${title}`}</div>;
    const descriptionHtml = <div className="text-xs">{`${description}`}</div>;
    if (index == 0) {
      return <Timeline.Item title={titleHtml} description={descriptionHtml} color={color} />;
    }
    return <Timeline.Item title={titleHtml} description={descriptionHtml} color="grey" />;
  };

  const mapProductsToRow = (products: ItemisedDetails, index: number) => {
    {
      const {categoryCode, quantity, unitPrice, totalAmount} = products;

      const category = `${categoryCode.slice(0, 2)}\t`;
      const subCategory = `${categoryCode.slice(-2)}\t`;

      return (
        <DataTableRow key={index}>
          <DataTableCell className="w-1/9">{category}</DataTableCell>
          <DataTableCell className="w-1/4">{subCategory}</DataTableCell>
          <DataTableCell className="w-1/6">{quantity}</DataTableCell>
          <DataTableCell className="w-1/6">{unitPrice}</DataTableCell>
          <DataTableCell className="w-1/9">{totalAmount}</DataTableCell>
        </DataTableRow>
      );
    }
  };

  const prettyBrand = PaymentPrettyTextMapping[brand];

  const timelineTitle = <div className="text-black text-xl leading-6">Timeline</div>;
  const productDetailsTitle = <div className="text-black text-xl leading-6">Product details</div>;
  const cardTitle = !isLoading ? `${prettyBrand || ''} - ${displayedPan || ''}` : <Skeleton />;
  const statusColor = TerminalSwitchTransactionStatusMapColor[data?.status] as BadgeProps['color'];
  const loyaltyIssuanceText =
    !!data?.loyaltyCardAttributes &&
    (data.type === TerminalSwitchTransactionType.CHARGE ||
      data.type === TerminalSwitchTransactionType.CAPTURE)
      ? 'Yes'
      : 'No';

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex">
          <h1 className={`${classes.h2}`} style={{color: '#2D333A'}}>
            {!_.isEmpty(card) && cardTitle}
          </h1>
        </div>
        <Card expandable defaultIsOpen className="mb-8 mt-8">
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
                    <Badge rounded="rounded" color={statusColor}>
                      {data.status}
                    </Badge>
                  )
                }
              />
              <SkeletonDescItem isLoading={isLoading} label="RRN" value={data?.referenceId} />
              <SkeletonDescItem isLoading={isLoading} label="Transaction ID" value={data?.id} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Created date"
                value={data?.createdAt}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Created Time"
                value={data && Date.parse(`${data.createdAt}`)}
              />
              <SkeletonDescItem isLoading={isLoading} label="STAN" value={data?.stan} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Payment card number"
                value={data?.card.maskedPan}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Loyalty card number"
                value={data?.loyaltyCardAttributes?.maskedPan}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Vehicle card number"
                value={data?.fleetCardAttributes?.maskedCardNumberDriver}
              />
              <SkeletonDescItem isLoading={isLoading} label="Amount" value={data?.amount} />
              <SkeletonDescItem isLoading={isLoading} label="Transaction type" value={data?.type} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Void Flag"
                value={data?.status === TerminalSwitchTransactionStatus.VOIDED ? 'Yes' : 'No'}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Loyalty issuance"
                value={loyaltyIssuanceText}
              />
            </DescList>
          </Card.Content>
          <Card.Content className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              MERCHANT
            </Text>
            <DescList isLoading={isLoading}>
              <SkeletonDescItem isLoading={isLoading} label="TID" value={data?.merchantId} />
              <SkeletonDescItem isLoading={isLoading} label="MID" value={data?.terminalId} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Merchant name"
                value={data?.merchantName}
              />
              <SkeletonDescItem isLoading={isLoading} label="Batch no" value={data?.batchNum} />
            </DescList>
          </Card.Content>
          <Card.Content className="flex border-b border-gray-200">
            <Text className={`${classes.label} w-44 mr-11`} color="lightgrey">
              ACQUIRER DETAILS
            </Text>
            <DescList isLoading={isLoading}>
              <SkeletonDescItem isLoading={isLoading} label="Host" value={data?.acquirer.type} />
              <SkeletonDescItem
                isLoading={isLoading}
                label="TID"
                value={data?.acquirer.terminalId}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="MID"
                value={data?.acquirer.merchantId}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Approval code"
                value={data?.acquirerResponse?.approvalCode}
              />
              <SkeletonDescItem
                isLoading={isLoading}
                label="Response code"
                value={data?.acquirerResponse?.responseCode}
              />
            </DescList>
          </Card.Content>
        </Card>

        <DataTable heading={<CardHeading title={productDetailsTitle} />}>
          <DataTableRowGroup groupType="thead">
            <DataTableRow>
              <DataTableCell className="w-1/9">CATEGORY</DataTableCell>
              <DataTableCell className="w-1/4">SUBCATEGORY</DataTableCell>
              <DataTableCell className="w-1/6">QUANTITY</DataTableCell>
              <DataTableCell className="w-1/6">UNIT PRICE (RM)</DataTableCell>
              <DataTableCell className="w-1/9">TOTAL</DataTableCell>
            </DataTableRow>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.products?.map((item: ItemisedDetails, index: number) =>
              mapProductsToRow(item, index),
            )}
          </DataTableRowGroup>
          <DataTableCaption>
            {!data?.products && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No products was found</p>
              </div>
            )}
          </DataTableCaption>
        </DataTable>

        <Card expandable defaultIsOpen className="mb-8 mt-8">
          <Card.Heading title={timelineTitle}></Card.Heading>
          <Card.Content className="p-7">
            <Timeline>
              {data?.timeline &&
                data.timeline.map((item, index) => {
                  return mappingTimelineItem(item, index);
                })}
            </Timeline>
          </Card.Content>
        </Card>

        <JsonPanel
          className="text-black mb-8 mt-8"
          allowToggleFormat
          json={Object.assign({...data})}
        />
      </div>
    </>
  );
};
