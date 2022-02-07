import {ExternalIcon, IconButton} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';

export const SetelShareUserExternalIcon = (props: {userId: string}) => {
  const router = useRouter();
  return (
    <IconButton
      className="pl-2 p-0"
      data-testid="setelshare-datail-navigate-to-account-detail"
      onClick={() => {
        router.navigate([`/customers/${props.userId}`], {
          queryParams: {tabIndex: 3},
          fragment: 'customer-risk-profile-details',
        });
      }}>
      <ExternalIcon className="text-brand-500 w-5 h-5" />
    </IconButton>
  );
};
