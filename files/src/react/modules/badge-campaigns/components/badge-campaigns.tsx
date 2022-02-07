import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {BadgeGroupList} from './badge-group/badge-group-list';
import {BadgeList} from './badge-list';

export type BadgeCampaignsTabType = 'badge-list' | 'badge-groups';
const TABS = ['badge-list', 'badge-groups'] as const;
export type BadgeCampaignsProps = {tab: BadgeCampaignsTabType};
export const BadgeCampaigns = (props: BadgeCampaignsProps) => {
  const router = useRouter();
  return (
    <Tabs
      index={TABS.indexOf(props.tab)}
      onChange={(index) => router.navigateByUrl(`gamification/badge-campaigns/${TABS[index]}`)}>
      <Tabs.TabList className="bg-white px-8 py-2 shadow">
        <Tabs.Tab label="Badge campaign list" />
        <Tabs.Tab label="Badge groups" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>{props.tab === 'badge-list' && <BadgeList />}</Tabs.Panel>
        <Tabs.Panel>{props.tab === 'badge-groups' && <BadgeGroupList />}</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
