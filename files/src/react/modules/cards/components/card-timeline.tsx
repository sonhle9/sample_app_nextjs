import * as React from 'react';
import {
  ArrowLeftIcon,
  Card,
  CardContent,
  CardHeading,
  DescList,
  formatDate,
  IndicatorProps,
  Timeline,
  titleCase,
} from '@setel/portal-ui';
import {EStatus} from 'src/app/cards/shared/enums';
import {ITimeline} from '../card.type';

const colorByStatus: Record<string, IndicatorProps['color']> = {
  [EStatus.ACTIVE]: 'success',
  [EStatus.PENDING]: 'lemon',
  [EStatus.FROZEN]: 'error',
  [EStatus.CLOSED]: 'grey',
  [EStatus.ISSUED]: 'success',
};

export function CardTimeline({
  timelines,
  className,
}: {
  timelines: Array<ITimeline>;
  className: string;
}) {
  const [showMoreTimeline, setShowMoreTimeline] = React.useState(false);
  const timelineList = [...timelines];
  return (
    <Card className={className}>
      <CardHeading title="Timeline" />
      <CardContent className="p-7">
        <Timeline>
          {timelineList.reverse().map(
            (item, index) =>
              (index < 5 || showMoreTimeline) && (
                <Timeline.Item
                  title={titleCase(item.status)}
                  description={<></>}
                  color={colorByStatus[item.status] || 'purple'}
                  key={index}>
                  {!Object.values(EStatus).toString().includes(item.status) ? (
                    <>
                      <DescList>
                        <DescList.Item
                          label={
                            <div className="flex text-black text-sm">
                              RM{item?.data?.before || 0}{' '}
                              {<ArrowLeftIcon className="mx-2 h-5 transform rotate-180" />} RM
                              {item?.data?.after || 0}
                            </div>
                          }
                          value=""
                        />
                        <DescList.Item label="Updated by" value={item?.data?.updatedBy || '-'} />
                        <DescList.Item label="Updated on" value={formatDate(item.date)} />
                      </DescList>
                    </>
                  ) : item.status === EStatus.ACTIVE || item.status === EStatus.FROZEN ? (
                    <DescList>
                      <DescList.Item
                        label="Reason code"
                        value={titleCase(item?.data?.reason) || '-'}
                      />
                      <DescList.Item label="Remarks" value={item?.data?.remark || '-'} />
                      <DescList.Item label="Updated by" value={item?.data?.updatedBy || '-'} />
                      <DescList.Item label="Updated on" value={formatDate(item.date)} />
                    </DescList>
                  ) : (
                    <DescList>
                      <DescList.Item label="Updated on" value={formatDate(item.date)} />
                    </DescList>
                  )}
                </Timeline.Item>
              ),
          )}
        </Timeline>
        {timelines && timelines.length > 5 && (
          <div className="pt-2 pl-4 mb-2 mt-4 border-t border-gray-200">
            <button
              onClick={() => setShowMoreTimeline((s) => !s)}
              className="text-xs tracking-1 font-bold text-brand-500 focus:outline-none focus-visible:shadow-outline-brand"
              type="button">
              {showMoreTimeline ? 'VIEW LESS' : 'VIEW ALL'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
