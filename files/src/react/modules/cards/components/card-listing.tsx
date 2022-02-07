import {Card, Tabs} from '@setel/portal-ui';
import React, {useCallback, useEffect} from 'react';
import {useQueryParams, useSetQueryParams} from 'src/react/routing/routing.context';
import {EType} from 'src/shared/enums/card.enum';
import {cardGroupRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {CardList} from './card-list';

export const CardListing = () => {
  const getQueryParams = useQueryParams();
  const setQueryParams = useSetQueryParams();
  const [isActive, setIsActive] = React.useState(true);
  const [tabSelected, setTabSelected] = React.useState<number>(
    Number(getQueryParams.params?.tab) || 0,
  );

  const handleChangeTab = useCallback(
    (tabIndex: number) => {
      if (tabSelected === tabIndex) return;

      setIsActive(false);
      setTabSelected(tabIndex);
      setQueryParams({tab: tabIndex}, {merge: false});
    },
    [tabSelected],
  );

  useEffect(() => {
    const active = Number(getQueryParams.params?.tab) === tabSelected;
    if (active) {
      setIsActive(active);
    } else {
      setQueryParams({tab: tabSelected}, {merge: active});
    }
  }, [tabSelected, getQueryParams.params]);

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
              <Tabs.Tab label="Fleet" />
              <Tabs.Tab label="Loyalty" />
            </Tabs.TabList>
          </Card>
          <Tabs.Panels>
            <Tabs.Panel>
              <CardList cardType={EType.GIFT} isActive={isActive} title="Gift card" />
            </Tabs.Panel>
            <Tabs.Panel>
              <CardList cardType={EType.FLEET} isActive={isActive} title="Fleet card" />
            </Tabs.Panel>
            <Tabs.Panel>
              <CardList cardType={EType.LOYALTY} isActive={isActive} title="Loyalty card" />
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </HasPermission>
    </>
  );
};
