import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {useParams} from 'src/react/routing/routing.context';
import {customerRole} from 'src/shared/helpers/roles.type';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {useGetUserCreditCard} from '../../customers.queries';

export function CustomerCardDetails() {
  const {id, cardId} = useParams();
  const {data, isLoading, error} = useGetUserCreditCard(id, cardId);

  return (
    <HasPermission accessWith={[customerRole.read]}>
      {!isLoading && (
        <PageContainer heading="Customer Card Details">
          {!data ? (
            <QueryErrorAlert className="mt-4 mx-10" error={(error as any) || null} />
          ) : (
            <JsonPanel
              allowToggleFormat
              defaultOpen
              json={{...data}}
              data-testid="customer-card-details-json"
            />
          )}
        </PageContainer>
      )}
    </HasPermission>
  );
}
