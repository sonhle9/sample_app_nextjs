import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {StationDetails} from './station-details';

export type StationsTabType = 'details' | 'orders' | 'deliver2me' | 'over-counter';
const TABS = ['details', 'orders', 'deliver2me', 'over-counter'] as const;
export type StationsProps = {stationId: string; tab: StationsTabType};
export const Stations = (props: StationsProps) => {
  const router = useRouter();

  return (
    <Tabs
      index={TABS.indexOf(props.tab)}
      onChange={(index) => router.navigateByUrl(`stations/${props.stationId}/${TABS[index]}`)}>
      <Tabs.TabList className="bg-white px-8 py-2 shadow">
        <Tabs.Tab label="Details" />
        <Tabs.Tab label="Orders" />
        <Tabs.Tab label="Deliver2Me" />
        <Tabs.Tab label="Over counter" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          {props.tab === 'details' && <StationDetails stationId={props.stationId} />}
        </Tabs.Panel>
        <Tabs.Panel>{props.tab === 'orders' && <h1>hello orders</h1>}</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
