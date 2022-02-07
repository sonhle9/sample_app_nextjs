import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useParams, useRouter} from 'src/react/routing/routing.context';
import {BillList} from './account-details-bills';
import {AccountGeneralDetails} from './account-details-general';
import {TransactionPaymentHistory} from './account-details-transaction-payment-history';

export interface IAccountDetailsProps {
  id: string;
}

export const AccountDetails = (props: IAccountDetailsProps) => {
  const {id} = props;
  const params = useParams();
  const router = useRouter();
  const activeTabIndex = TABS.indexOf(params.tab) || 0;

  return (
    <Tabs
      index={activeTabIndex}
      onChange={(index) => {
        router.navigateByUrl(`buy-now-pay-later/accounts/details/${props.id}/${TABS[index]}`);
      }}>
      <Tabs.TabList>
        <Tabs.Tab label="General" />
        <Tabs.Tab label="Bills" />
        <Tabs.Tab label="Transaction payment history" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          <AccountGeneralDetails id={id} />
        </Tabs.Panel>
        <Tabs.Panel>
          <BillList />
        </Tabs.Panel>
        <Tabs.Panel>
          <TransactionPaymentHistory />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};

const TABS = ['general', 'bills', 'transaction-payment-history'];
