import {Badge} from '@setel/portal-ui';
import * as React from 'react';
import {IBadgeStatus} from 'src/react/modules/badge-campaigns/badge-campaigns.type';

const COLOR_BY_STATUS: Record<IBadgeStatus, React.ComponentProps<typeof Badge>['color']> = {
  ACTIVE: 'success',
  DRAFT: 'grey',
  INACTIVE: 'error',
  ARCHIVED: 'purple',
};

const LABEL_BY_STATUS: Record<IBadgeStatus, string> = {
  ACTIVE: 'launched',
  DRAFT: 'draft',
  INACTIVE: 'stopped',
  ARCHIVED: 'archived',
};

type Props = {status: string};
export function BadgeStatus({status}: Props) {
  return (
    <Badge
      className="tracking-wider font-semibold uppercase"
      rounded="rounded"
      color={COLOR_BY_STATUS[status]}>
      {LABEL_BY_STATUS[status]}
    </Badge>
  );
}
