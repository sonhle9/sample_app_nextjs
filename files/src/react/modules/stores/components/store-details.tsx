import * as React from 'react';

import {Alert, Badge, Card, DescList, Tabs} from '@setel/portal-ui';
import {ProductList} from './product-list';
import {PageContainer} from 'src/react/components/page-container';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {useStore} from '../stores.queries';
import {IStore} from '../stores.types';
import {getStoreStatusColor, toStoreTypeOption, useUserCanUpdateStore} from '../stores.helpers';
import {StoreOperatingHours} from './store-operating-hours';
import {StoreEdit} from './store-edit';
import {Link} from '../../../routing/link';
import {useRouter} from 'src/react/routing/routing.context';
import {STORE_FULFILMENT_LABELS, STORE_STATUS_LABELS, STORE_TRIGGER_LABELS} from '../stores.const';
import {ShopOnly} from './shop-only-store';
import {StoreHistory} from './store-history';

export interface IStoreDetailsProps {
  storeId: string;
  tab: 'details' | 'items' | 'shopOnly';
}

const GENERAL_FIELDS: {
  key: keyof IStore;
  label: string;
  accessor: (store: IStore) => React.ReactNode;
}[] = [
  {
    key: 'storeId',
    label: 'Store ID',
    accessor: (s) => s?.storeId,
  },
  {
    key: 'isMesra',
    label: 'Store Type',
    accessor: (s) => toStoreTypeOption(s?.isMesra),
  },
  {
    key: 'name',
    label: 'Store Name',
    accessor: (s) => s?.name,
  },
  {
    key: 'stationId',
    label: 'Station ID',
    accessor: (s) => s?.stationId,
  },
  {
    key: 'stationName',
    label: 'Station Name',
    accessor: (s) => <Link to={`stations/${s?.stationId}/details`}>{s?.stationName}</Link>,
  },
  {
    key: 'fulfilments',
    label: 'Fulfilment type',
    accessor: (s) =>
      s?.fulfilments?.map((fulfilment) => STORE_FULFILMENT_LABELS[fulfilment.type]).join(', ') ||
      '-',
  },
  {
    key: 'triggers',
    label: 'Ordering trigger',
    accessor: (s) =>
      s?.triggers
        ?.filter((trigger) => trigger.status === 'active')
        .map((trigger) => STORE_TRIGGER_LABELS[trigger.event])
        .join(', ') || '-',
  },
  {
    key: 'merchantId',
    label: 'Merchant ID',
    accessor: (s) => (
      <a href={`${CURRENT_ENTERPRISE.dashboardUrl}?merchantId=${s?.merchantId}`} target="_blank">
        {s?.merchantId}
      </a>
    ),
  },
  {
    key: 'pdbMerchantId',
    label: 'PDB Merchant ID',
    accessor: (s) => s?.pdbMerchantId,
  },
  {
    key: 'operatingHours',
    label: 'Status',
    accessor: (s) => {
      if (!s?.operatingHours?.length) {
        return (
          <Alert variant="warning" description="Store is inactive until you add operation hours" />
        );
      }
      return (
        <Badge
          size="large"
          rounded="rounded"
          color={getStoreStatusColor(s.status)}
          className="uppercase tracking-wider">
          {STORE_STATUS_LABELS[s.status]}
        </Badge>
      );
    },
  },
];

function StoreGeneralDetails(props: {storeId: string}) {
  const {data: store, isLoading, isError, error} = useStore(props.storeId);
  const canEdit = useUserCanUpdateStore();
  return (
    <PageContainer>
      {isError ? (
        <Alert variant="error" description={error.response?.data?.message} />
      ) : (
        <>
          <Card className="mb-8">
            <Card.Heading title={'General'}>
              {canEdit && store && <StoreEdit storeId={props.storeId} />}
            </Card.Heading>
            <Card.Content>
              <DescList isLoading={isLoading}>
                {GENERAL_FIELDS.map(({key, label, accessor}) => (
                  <DescList.Item
                    key={key}
                    label={label}
                    value={isLoading ? undefined : accessor(store)}
                  />
                ))}
              </DescList>
            </Card.Content>
          </Card>
          <StoreOperatingHours storeId={props.storeId} />
          <StoreHistory storeId={props.storeId} />
        </>
      )}
    </PageContainer>
  );
}

const TABS = ['details', 'items', 'shopOnly'] as const;

export function StoreDetails(props: IStoreDetailsProps) {
  const router = useRouter();

  return (
    <Tabs
      index={TABS.indexOf(props.tab)}
      onChange={(index) => {
        router.navigateByUrl(`stores/${props.storeId}/${TABS[index]}`);
      }}>
      <Tabs.TabList>
        <Tabs.Tab label="Store details" />
        <Tabs.Tab label="Store items" />
        <Tabs.Tab label="Shop only" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          {props.tab === 'details' && <StoreGeneralDetails storeId={props.storeId} />}
        </Tabs.Panel>
        <Tabs.Panel>{props.tab === 'items' && <ProductList storeId={props.storeId} />}</Tabs.Panel>
        <Tabs.Panel>{props.tab === 'shopOnly' && <ShopOnly storeId={props.storeId} />}</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
