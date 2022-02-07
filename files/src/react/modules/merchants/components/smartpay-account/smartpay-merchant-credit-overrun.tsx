import {Button, Card, PlusIcon, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from '../../../../hooks/use-notification';
import {CreditPeriodOverrun} from './credit-overrun/credit-period-overrun';
// import {CreditLimitOverrun} from './credit-overrun/credit-limit-overrun';
import {CreditPeriodOverrunModal} from './credit-overrun/credit-period-overrun-modal';
import {CreditLimitOverrunModal} from './credit-overrun/credit-limit-overrun-modal';
import {CreditPeriodOverrunHistory} from './credit-overrun/credit-period-overrun-history';

// import {CreditLimitOverrunHistory} from './credit-overrun/credit-limit-overrun-history';

interface CreditOverrunProps {
  merchantId: string;
  merchantStatus: string;
}

export const SmartpayMerchantCreditOverrun = (props: CreditOverrunProps) => {
  return (
    <React.Fragment>
      <CreditOverrunSection merchantId={props.merchantId} merchantStatus={props.merchantStatus} />
      {/*<CreditHistorySection merchantId={props.merchantId} />*/}
    </React.Fragment>
  );
};

const CreditOverrunSection = (props: {merchantId: string; merchantStatus: string}) => {
  const tabs = [
    {
      label: 'Credit period overrun',
      Content: CreditPeriodOverrun,
    },
    // {
    //   label: 'Credit limit overrun',
    //   Content: CreditLimitOverrun,
    // },
  ];

  const setNotify = useNotification();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Card>
      <Card.Heading title="Credit overrun">
        <Button
          variant="outline"
          leftIcon={<PlusIcon />}
          onClick={() => {
            setShowCreateModal(true);
          }}>
          CREATE
        </Button>
      </Card.Heading>
      <Card.Content className={'px-0 py-0'}>
        <Tabs index={tabIndex} onChange={setTabIndex}>
          <Tabs.TabList className={'px-5 sticky top-0'}>
            {tabs.map((tab, index) => (
              <Tabs.Tab label={tab.label} key={index} />
            ))}
          </Tabs.TabList>
          <Tabs.Panels>
            {tabs.map(({label, Content}, index) => (
              <Tabs.Panel key={label}>
                {index === tabIndex && <Content merchantId={props.merchantId} />}
              </Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs>
        {showCreateModal && tabIndex === 0 && (
          <CreditPeriodOverrunModal
            merchantId={props.merchantId}
            merchantStatus={props.merchantStatus}
            onDone={() => {
              setNotify({
                title: 'Successful!',
                description: 'Credit period overrun has been successfully submitted',
              });
              setShowCreateModal(false);
            }}
            onCancel={() => {
              setShowCreateModal(false);
            }}
          />
        )}

        {showCreateModal && tabIndex === 1 && (
          <CreditLimitOverrunModal
            merchantId={props.merchantId}
            onDone={() => {
              setNotify({
                title: 'Successful',
                description: 'Successfully created.',
              });
              setShowCreateModal(false);
            }}
          />
        )}
      </Card.Content>
    </Card>
  );
};

// @ts-ignore
const CreditHistorySection = (props: {merchantId: string}) => {
  const tabs = [
    {
      label: 'Credit period overrun',
      Content: CreditPeriodOverrunHistory,
    },
    // {
    //   label: 'Credit limit overrun',
    //   Content: CreditLimitOverrunHistory,
    // },
  ];

  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Card className={'mt-6'}>
      <Card.Heading title="Credit overrun history" />
      <Card.Content className={'px-0 py-0'}>
        <Tabs index={tabIndex} onChange={setTabIndex}>
          <Tabs.TabList className={'mb-6 px-5 sticky top-0'}>
            {tabs.map((tab, index) => (
              <Tabs.Tab label={tab.label} key={index} />
            ))}
          </Tabs.TabList>
          <Tabs.Panels>
            {tabs.map(({label, Content}, index) => (
              <Tabs.Panel key={label}>
                {index === tabIndex && <Content merchantId={props.merchantId} />}
              </Tabs.Panel>
            ))}
          </Tabs.Panels>
        </Tabs>
      </Card.Content>
    </Card>
  );
};
