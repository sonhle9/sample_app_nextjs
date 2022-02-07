import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useParams, useRouter} from 'src/react/routing/routing.context';
import {TerminalSwitchFullMidTidMappingReportsListing} from './terminal-switch-full-mid-tid-reports-listing';
import {TerminalSwitchHourlyTransactionFileListing} from './terminal-switch-hourly-transaction-file-listing';

const tabs = ['hourly-transaction-file', 'full-mti-tid-mapping'];

export const TerminalSwitchHourlyTransactionFileTab = () => {
  const params = useParams();
  const router = useRouter();

  const activeTabIndex = tabs.indexOf(params.tab) || 0;

  return (
    <Tabs
      index={activeTabIndex}
      onChange={(newIndex) => {
        router.navigateByUrl(`/gateway/csv-reports/${tabs[newIndex]}`);
      }}>
      <Tabs.TabList>
        <Tabs.Tab label="Hourly Transaction File" />
        <Tabs.Tab label="Full MID & TID mapping monthly report" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          {activeTabIndex === 0 && <TerminalSwitchHourlyTransactionFileListing />}
        </Tabs.Panel>
        <Tabs.Panel>
          {activeTabIndex === 1 && <TerminalSwitchFullMidTidMappingReportsListing />}
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
