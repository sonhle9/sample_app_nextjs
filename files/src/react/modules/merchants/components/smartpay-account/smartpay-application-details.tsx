import * as React from 'react';
import {useQueryParams, useSetQueryParams} from '../../../../routing/routing.context';
import {Tabs} from '@setel/portal-ui';
import {SmartpayDetailsAssessmentDeposit} from './smartpay-details-assessment-deposit';
import {SmartpayDetailsSecurityDeposit} from './smartpay-details-security-deposit';
import {SmartpayDetailsSubsidyPlan} from './smartpay-details-subsidy-plan';
import {SmartpayDetailsFileManager} from './smartpay-details-file-manager';
import {SmartpayDetailsContactList} from './smartpay-details-contact-list';
import {SmartpayDetailsAddressList} from './smartpay-details-address-list';
import {SmartpayApplicationDetailsGeneral} from './smartpay-application-details-general';

const tabs = [
  {
    label: 'General',
    Content: SmartpayApplicationDetailsGeneral,
  },
  {
    label: 'Credit assessment',
    Content: SmartpayDetailsAssessmentDeposit,
  },
  {
    label: 'Security deposit',
    Content: SmartpayDetailsSecurityDeposit,
  },
  {
    label: 'Subsidy plan',
    Content: SmartpayDetailsSubsidyPlan,
  },
  {
    label: 'File manager',
    Content: SmartpayDetailsFileManager,
  },
  {
    label: 'Address list',
    Content: SmartpayDetailsAddressList,
  },
  {
    label: 'Contact list',
    Content: SmartpayDetailsContactList,
  },
];

export const SmartpayApplicationDetails = (props: {id: string}) => {
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
              {index === tabIndex && <Content applicationId={props.id} />}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  );
};
