import {Card, CardContent, CardHeading, formatDate, Timeline} from '@setel/portal-ui';
import React from 'react';
import {BatchTimelineStatus, ForceCloseTimelineResponseDto} from '../terminal-switch-batches.type';

export const TerminalSwitchBatchCardTimeline = ({
  timelines,
  className,
}: {
  timelines: Array<ForceCloseTimelineResponseDto>;
  className: string;
}) => {
  const title = ({status, userEmail, remark}: ForceCloseTimelineResponseDto) => {
    switch (status) {
      case BatchTimelineStatus.REQUESTED:
        return `${userEmail}: Pending Force Close Approval - ${remark}`;
      case BatchTimelineStatus.APPROVED:
        return `${userEmail}: Force Close Approval- Approved, ${remark}`;
      case BatchTimelineStatus.REJECTED:
        return `${userEmail}: Force Close Approval- Rejected, ${remark}.`;
      case BatchTimelineStatus.SUCCEEDED:
        return `Settlement successful`;
      default:
        return 'System is processing Settlement with host';
    }
  };

  const indicatorClassColorTimeline = (status: BatchTimelineStatus) => {
    switch (status) {
      case BatchTimelineStatus.REQUESTED:
        return 'bg-lemon-200';
      case BatchTimelineStatus.APPROVED:
        return 'bg-blue-200';
      case BatchTimelineStatus.FAILED:
        return 'bg-purple-200';
      case BatchTimelineStatus.REJECTED:
        return 'bg-error-200';
      case BatchTimelineStatus.SUCCEEDED:
        return 'bg-success-200';
      default:
        return '';
    }
  };

  return (
    <Card className={className} expandable>
      <CardHeading title={'Remarks'} />
      {timelines?.length > 0 && (
        <CardContent className="p-7">
          <Timeline>
            {timelines?.map((timeline, index) => (
              <Timeline.Item
                title={<span className={'text-sm'}>{title(timeline)}</span>}
                description={
                  <>
                    <p className={'text-xs'}>{formatDate(timeline?.date)}</p>
                  </>
                }
                indicatorClass={indicatorClassColorTimeline(timeline.status)}
                key={index}
              />
            ))}
          </Timeline>
        </CardContent>
      )}
    </Card>
  );
};
