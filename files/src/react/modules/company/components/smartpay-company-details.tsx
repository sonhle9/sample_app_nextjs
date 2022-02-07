import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useQueryParams, useSetQueryParams} from '../../../routing/routing.context';
import {ICompany} from '../companies.type';
import {CompanyAddressList} from './company-address-list';
import {CompanyContactList} from './company-contact-list';
import {CompanyGeneralDetails} from './company-general-details';

type SmartpayCompanyDetailsProps = {
  company: ICompany;
  id: string;
};

const tabs = [
  {
    label: 'General',
    Content: CompanyGeneralDetails,
  },
  {
    label: 'Address list',
    Content: CompanyAddressList,
  },
  {
    label: 'Contact list',
    Content: CompanyContactList,
  },
];

export const SmartpayCompanyDetails = (props: SmartpayCompanyDetailsProps) => {
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
              {index === tabIndex && <Content id={props.id} company={props.company} />}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Panels>
    </Tabs>
  );
};
