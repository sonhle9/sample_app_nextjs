import {classes, Card, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useQueryParams, useSetQueryParams} from 'src/react/routing/routing.context';
import {HasPermission} from '../../auth/HasPermission';
import {approvalRequestRole} from 'src/shared/helpers/pdb.roles.type';
import {AllApprovalRequestsListing} from './all-approval-request-listing';
import {MyApprovalRequestsListing} from './my-approval-request-listing';

export const ApprovalRequestsListing = () => {
  const activated = useQueryParams();

  return activated ? <ApprovalRequestsList /> : null;
};

const ApprovalRequestsList = () => {
  const getQueryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();
  const [iActive, setIActive] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<number>(
    Number(getQueryParams.params?.activeTab) || 0,
  );

  const handleChangeTab = React.useCallback(
    (tabIndex: number) => {
      if (activeTab === tabIndex) return;

      setIActive(false);
      setActiveTab(tabIndex);
      setQueryParams({tab: tabIndex}, {merge: false});
    },
    [activeTab],
  );

  React.useEffect(() => {
    const active = Number(getQueryParams.params?.tab) === activeTab;
    setQueryParams({tab: activeTab}, {merge: active});
    if (active) {
      setIActive(active);
    }
  }, [activeTab, getQueryParams.params?.tab]);

  return (
    <>
      <HasPermission accessWith={[approvalRequestRole.view]}>
        <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex justify-between">
            <h1 className={classes.h1}>Approval requests</h1>
          </div>

          <Tabs index={activeTab} onChange={handleChangeTab}>
            <Card style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
              <Card.Heading title="General" />
              <Tabs.TabList>
                <Tabs.Tab label="All approval requests" />
                <Tabs.Tab label="My approval requests" />
              </Tabs.TabList>
            </Card>
            <Tabs.Panels>
              <Tabs.Panel>
                <AllApprovalRequestsListing iActive={iActive} />
              </Tabs.Panel>
              <Tabs.Panel>
                <MyApprovalRequestsListing iActive={iActive} />
              </Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </div>
      </HasPermission>
    </>
  );
};

export default ApprovalRequestsListing;
