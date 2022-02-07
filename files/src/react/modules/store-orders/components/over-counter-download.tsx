import * as React from 'react';
import _pickBy from 'lodash/pickBy';
import {Button, DownloadIcon} from '@setel/portal-ui';
import {useDownloadOverCounterStoreOrders} from '../store-orders.queries';
import {IStoreOrderFilter} from '../../../services/api-store-orders.type';
import {HasPermission} from '../../auth/HasPermission';
import {downloadTextFile} from '../store-orders.helpers';
import {retailRoles} from 'src/shared/helpers/roles.type';

export function OverCounterDownload(props: {filter: IStoreOrderFilter}) {
  const {mutate: downloadStoreOrders, isLoading: isDownloading} = useDownloadOverCounterStoreOrders(
    {
      onSuccess(csv) {
        downloadTextFile(
          csv,
          `over-counter-store-orders.${new Date().toISOString()}.${JSON.stringify(
            _pickBy(props.filter, Boolean),
          )}.csv`,
        );
      },
    },
  );

  return (
    <HasPermission accessWith={[retailRoles.storeOrderExport]}>
      <Button
        leftIcon={<DownloadIcon />}
        variant="outline"
        onClick={() => downloadStoreOrders(props.filter)}
        disabled={isDownloading}
        data-testid="over-counter-csv-download">
        DOWNLOAD CSV
      </Button>
    </HasPermission>
  );
}
