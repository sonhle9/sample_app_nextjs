import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useQueryParams, useSetQueryParams} from '../../../../routing/routing.context';
import {SmartpayApplicationListing} from './smartpay-application-listing';
import {SmartpayAccountListing} from './smartpay-account-listing';
import {useReadOpsUserDetails} from '../../merchants.queries';

const tabs = [
  {
    label: 'Applications',
    Content: SmartpayApplicationListing,
  },
  {
    label: 'Accounts',
    Content: SmartpayAccountListing,
  },
];

export const SmartpayAccountTabs = (props: {userId: string; userEmail?: string}) => {
  const queryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();

  const initTab = tabs.findIndex((tab) => tab.label === queryParams.params?.tab);

  const [tabIndex, setTabIndex] = React.useState(initTab > -1 ? initTab : 0);

  React.useEffect(() => {
    const matchedTabIndex = tabs.findIndex((tab) => tab.label === queryParams.params?.tab);
    if (matchedTabIndex !== -1) {
      setTabIndex(matchedTabIndex);
    } else {
      setTabIndex(0);
    }
  }, [queryParams.params?.tab]);

  React.useEffect(() => {
    setQueryParams({tab: tabs[tabIndex].label}, {merge: true});
  }, [tabIndex]);

  const {data} = useReadOpsUserDetails(props.userId);

  const email = props.userEmail || data?.email;

  return (
    <Tabs index={tabIndex} onChange={setTabIndex}>
      <Tabs.TabList className={'mb-6 px-5 sticky top-0'}>
        {tabs.map((tab, index) => (
          <Tabs.Tab label={tab.label} key={index} />
        ))}
      </Tabs.TabList>
      <Tabs.Panels>
        {tabs.map(({label, Content}, index) => (
          <Tabs.Panel key={label}>
            <div className={'px-20 pb-10'}>
              {index === tabIndex && <Content userEmail={email} />}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  );
};
