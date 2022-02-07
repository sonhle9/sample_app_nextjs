import {DataTableCaption, DataTableCaptionProps} from '@setel/portal-ui';
import * as React from 'react';
import cx from 'classnames';

interface EmptyDataTableCaptionProps extends DataTableCaptionProps {
  content?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyDataTableCaption = ({
  content = 'You have no data to be displayed here',
  action,
  ...props
}: EmptyDataTableCaptionProps) => (
  <DataTableCaption className={props.className || cx('space-y-4 py-10', props.className)}>
    <p className="text-center">{content}</p>
    {action && <div className="flex justify-center">{action}</div>}
  </DataTableCaption>
);
