import * as React from 'react';
import {
  BareButton,
  Card,
  CardContent,
  CardHeading,
  DescList,
  formatDate,
  formatMoney,
  Timeline,
  titleCase,
} from '@setel/portal-ui';
import {ICardFleetTransaction} from '../transaction.type';
import {colorByStatusTimeline} from './transaction-fleet-status';
import {EStatus} from '../emum';

export function TransactionFleetTimeline({
  transaction,
  numberTimelineShow = 3,
}: {
  transaction?: ICardFleetTransaction;
  numberTimelineShow?: number;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const dataTimeLine = [...(transaction?.timeline || [])];

  const setArrTimeLines = () => {
    if (numberTimelineShow && numberTimelineShow !== 0 && !showAll) {
      return dataTimeLine?.reverse().slice(0, numberTimelineShow);
    }
    return dataTimeLine?.reverse();
  };
  return (
    <Card data-testid="transaction-timeline-id" expandable defaultIsOpen>
      <CardHeading title="Timeline" />
      <CardContent className="p-7">
        <Timeline>
          {setArrTimeLines()?.map((item: any, index: number) => (
            <Timeline.Item
              title={
                <div className="text-base text-black font-medium"> {titleCase(item?.status)} </div>
              }
              color={colorByStatusTimeline[item.status] || 'purple'}
              key={index}>
              <>
                <DescList>
                  <DescList.Item
                    label={
                      (item?.status === EStatus.POSTED && item?.amount) ||
                      (item?.status === EStatus.SUCCEEDED && item?.amount) ||
                      (item?.status === EStatus.AUTHORISED && item?.amount)
                        ? 'Amount'
                        : item?.status === EStatus.SETTLED && item?.batchNumber
                        ? 'Batch number'
                        : ''
                    }
                    value={
                      (item?.status === EStatus.POSTED && item?.amount) ||
                      (item?.status === EStatus.SUCCEEDED && item?.amount) ||
                      (item?.status === EStatus.AUTHORISED && item?.amount)
                        ? `RM ${formatMoney(Number(item?.amount))}`
                        : item?.status === EStatus.SETTLED && item?.batchNumber
                        ? item?.batchNumber
                        : ''
                    }
                  />
                  <DescList.Item
                    label={item.status === EStatus.FAILED && 'Error'}
                    value={
                      item.status === EStatus.FAILED && transaction?.rawResponse?.responseCode
                        ? transaction?.rawResponse?.responseCode === '00'
                          ? `${transaction?.rawResponse?.responseCode} - Approved`
                          : `${transaction?.rawResponse?.responseCode} - ${transaction?.rawResponse?.errorDescription}`
                        : ''
                    }
                  />
                  <DescList.Item
                    label={item && 'Created on'}
                    value={
                      item?.createdAt &&
                      formatDate(item.createdAt, {
                        format: 'dd MMM yyyy, hh:mm:ss.SSS a',
                      })
                    }
                  />
                </DescList>
              </>
            </Timeline.Item>
          ))}
        </Timeline>
        {dataTimeLine?.length > numberTimelineShow && (
          <div className="pt-4 mt-6 border-t border-gray-200">
            <BareButton onClick={() => setShowAll((s) => !s)} className="text-brand-500">
              {showAll ? 'VIEW LESS' : 'VIEW ALL'}
            </BareButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
