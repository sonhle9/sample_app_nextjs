import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useRouter} from 'src/react/routing/routing.context';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {AuthContext} from '../../auth';
import {Deliver2MeOrderList} from './deliver2me-order-list';
import {OverCounterOrderList} from './over-counter-order-list';

const TABS = {
  'over-counter': {
    label: 'Over counter',
    path: 'over-counter',
    permissions: [retailRoles.storeOrderView],
    component: <OverCounterOrderList />,
  },
  deliver2me: {
    label: 'Deliver2Me',
    path: 'deliver2me',
    permissions: [retailRoles.storeInCarOrderView],
    component: <Deliver2MeOrderList />,
  },
};

export function StoreOrderList(props: {tab: keyof typeof TABS; children: React.ReactNode}) {
  const router = useRouter();
  const {permissions} = React.useContext(AuthContext);
  const tabs = Object.values(TABS).filter((tab) =>
    tab.permissions.some((p) => permissions.includes(p)),
  );
  const index = Math.max(tabs.indexOf(TABS[props.tab]), 0);

  React.useEffect(() => {
    if (tabs[index]?.path && !router.url.includes(tabs[index].path)) {
      router.navigateByUrl(`/store-orders/${tabs[index].path}`);
    }
  }, [router, tabs[index]]);

  return (
    <Tabs
      index={index}
      onChange={(value) => router.navigateByUrl(`/store-orders/${tabs[value].path}`)}>
      <Tabs.TabList>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.path} label={tab.label} />
        ))}
      </Tabs.TabList>
      <div className="py-6 max-w-screen-xl mx-auto sm:px-7">{tabs[index]?.component}</div>
    </Tabs>
  );
}
