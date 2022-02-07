import {Card, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useQueryParams, useSetQueryParams} from 'src/react/routing/routing.context';
import {cardGroupRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {CardGroupType} from '../card-group.type';
import {FleetCardGroupList} from './fleetCard-group-listing';
import {GiftCardGroupList} from './giftCard-group-listing';

export const CardGroupListing = () => {
  const getQueryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();
  const [iActive, setIActive] = React.useState(true);
  const [tabSelected, setTabSelected] = React.useState<number>(
    Number(getQueryParams.params?.tab) || 0,
  );

  const handleChangeTab = React.useCallback(
    (tabIndex: number) => {
      if (tabSelected === tabIndex) return;

      setIActive(false);
      setTabSelected(tabIndex);
      setQueryParams({tab: tabIndex}, {merge: false});
    },
    [tabSelected],
  );

  React.useEffect(() => {
    const active = Number(getQueryParams.params?.tab) === tabSelected;
    setQueryParams({tab: tabSelected}, {merge: active});
    if (active) {
      setIActive(active);
    }
  }, [tabSelected, getQueryParams.params?.tab]);

  return (
    <>
      <HasPermission accessWith={[cardGroupRole.view]}>
        <Tabs index={tabSelected} onChange={handleChangeTab}>
          <Card
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}>
            <Tabs.TabList>
              <Tabs.Tab label="Gift" />
              <Tabs.Tab label="Loyalty" />
              <Tabs.Tab label="Fleet" />
            </Tabs.TabList>
          </Card>
          <Tabs.Panels>
            <Tabs.Panel>
              <GiftCardGroupList iActive={iActive} cardGroupType={CardGroupType.GIFT} />
            </Tabs.Panel>
            <Tabs.Panel>
              <GiftCardGroupList iActive={iActive} cardGroupType={CardGroupType.LOYALTY} />
            </Tabs.Panel>
            <Tabs.Panel>
              <FleetCardGroupList iActive={iActive} cardGroupType={CardGroupType.FLEET} />
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </HasPermission>
    </>
  );
};
