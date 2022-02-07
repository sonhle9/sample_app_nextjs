import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {TerminalListing as SetelTerminalListing} from './setel-terminals-listing';
import {TerminalListing as InvencoTerminalListing} from '../../terminals/components/terminals-listing';
import {useParams, useRouter} from 'src/react/routing/routing.context';

export const TerminalsListingTabs = () => {
  const params = useParams();
  const router = useRouter();
  const activeTabIndex = tabs.indexOf(params.tab) || 0;

  return (
    <Tabs
      index={activeTabIndex}
      onChange={(newIndex) => {
        router.navigateByUrl(`/terminal/devices/${tabs[newIndex]}`);
      }}>
      <Tabs.TabList>
        <Tabs.Tab label="Setel Terminal" />
        <Tabs.Tab label="Invenco Terminal" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          <SetelTerminalListing enabled={activeTabIndex === 0} />
        </Tabs.Panel>
        <Tabs.Panel>
          <InvencoTerminalListing enabled={activeTabIndex === 1} />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};

const tabs = ['setel', 'invenco'];
