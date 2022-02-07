import * as React from 'react';
import {useQueryParams, useSetQueryParams} from '../../../../routing/routing.context';
import {Tabs} from '@setel/portal-ui';
import {SmartpayDetailsSecurityDeposit} from './smartpay-details-security-deposit';
import {SmartpayDetailsSubsidyPlan} from './smartpay-details-subsidy-plan';
import {SmartpayDetailsFileManager} from './smartpay-details-file-manager';
import {SmartpayDetailsContactList} from './smartpay-details-contact-list';
import {SmartpayDetailsAddressList} from './smartpay-details-address-list';
import {SmartpayAccountDetailsGeneral} from './smartpay-account-details-general';
import {useSmartpayAccountDetails} from '../../merchants.queries';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {SmartpayDetailsAssessmentDeposit} from './smartpay-details-assessment-deposit';
import {SmartpayDetailsBillingDetails} from './smartpay-details-billing-details';
import {SmartpayAccountTabs} from '../../../../../shared/enums/merchant.enum';
import {SmartpayMerchantCreditOverrun} from './smartpay-merchant-credit-overrun';
import {SmartpayDetailsBalances} from './smartpay-details-balances';

const tabs = [
  {
    label: 'General',
    Content: SmartpayAccountDetailsGeneral,
  },
  {
    label: 'Credit assessment',
    Content: SmartpayDetailsAssessmentDeposit,
  },
  {
    label: 'Balances',
    Content: SmartpayDetailsBalances,
  },
  {
    label: 'Security deposit',
    Content: SmartpayDetailsSecurityDeposit,
  },
  {
    label: SmartpayAccountTabs.BILLING,
    Content: SmartpayDetailsBillingDetails,
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
  {
    label: 'Credit overrun',
    Content: SmartpayMerchantCreditOverrun,
  },
];

export const SmartpayAccountDetails = (props: {id: string}) => {
  const queryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();

  const {data, error, isLoading} = useSmartpayAccountDetails(props.id);

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
    <>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
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
                {index === tabIndex && data && (
                  <Content
                    fleetPlan={data?.generalInfo?.fleetPlan}
                    // @ts-ignore
                    merchantStatus={data.generalInfo.status}
                    merchantId={data.merchantId}
                    applicationId={data.applicationId}
                  />
                )}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </>
  );
};
