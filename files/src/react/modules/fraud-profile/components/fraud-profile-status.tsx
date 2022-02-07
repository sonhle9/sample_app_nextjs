import {Badge} from '@setel/portal-ui';
import * as React from 'react';
import {FraudProfilesStatus} from 'src/react/services/api-blacklist.service';

export const FraudProfileStatus = (props: {status: FraudProfilesStatus}) => (
  <Badge color={statusColor[props.status]}>{props.status}</Badge>
);

const statusColor = {
  [FraudProfilesStatus.WATCHLISTED]: 'warning',
  [FraudProfilesStatus.CLEARED]: 'success',
  [FraudProfilesStatus.BLACKLISTED]: 'error',
} as const;
