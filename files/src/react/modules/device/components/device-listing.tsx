import {
  Badge,
  BadgeProps,
  BareButton,
  Button,
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  Modal,
  PaginationNavigation,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {DevicesStatus} from 'src/app/devices/shared/enums';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {listMerchantDevices, MerchantDevice} from 'src/react/services/api-merchants.service';
import {deviceStatusOptions} from '../device.const';
import {deviceCacheKeys} from '../device.queries';
import {DeviceForm} from './device-form';

export const DeviceListing = () => {
  const {
    query: {isLoading, data, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    queryKey: deviceCacheKeys.listDevices,
    queryFn: (values) => listMerchantDevices(values),
    initialFilter: {
      searchValue: '',
      dateRange: ['', ''] as [string, string],
      status: '',
    },
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: deviceStatusOptions,
          placeholder: 'All statuses',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created date',
        },
      },
      {
        key: 'searchValue',
        type: 'search',
        props: {
          placeholder: 'Search devices',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const dismissCreateModal = () => setShowCreateModal(false);

  const [deviceToEdit, setDeviceToEdit] = React.useState<MerchantDevice | undefined>(undefined);
  const dismissEditModal = () => setDeviceToEdit(undefined);

  return (
    <PageContainer
      heading="Devices"
      action={
        <Button variant="primary" onClick={() => setShowCreateModal(true)} leftIcon={<PlusIcon />}>
          CREATE
        </Button>
      }>
      <Modal isOpen={showCreateModal} onDismiss={dismissCreateModal} header="Add Device">
        <DeviceForm onDismiss={dismissCreateModal} />
      </Modal>
      <Modal isOpen={!!deviceToEdit} onDismiss={dismissEditModal} header="Edit Device">
        {deviceToEdit && <DeviceForm onDismiss={dismissEditModal} current={deviceToEdit} />}
      </Modal>
      <div className="space-y-5">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            data.items.length > 0 && (
              <PaginationNavigation
                variant="prev-next"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.nextPage * pagination.perPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Device ID</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>Serial Number</Table.Th>
              <Table.Th>Created at</Table.Th>
              <Table.Th>Last Seen</Table.Th>
              <Table.Th className="text-right">Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((device) => (
                <Table.Tr key={device.id}>
                  <Table.Td
                    render={(cellProps) => (
                      <Link {...cellProps} to={`/devices/details/${device.id}`} />
                    )}>
                    {device.id}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[device.status]}>{device.status}</Badge>
                  </Table.Td>
                  <Table.Td>{device.modelDevice}</Table.Td>
                  <Table.Td>{device.serialNo}</Table.Td>
                  <Table.Td>{formatDate(device.createdAt)}</Table.Td>
                  <Table.Td>{device.lastActivated && formatDate(device.lastActivated)}</Table.Td>
                  <Table.Td className="text-right">
                    <BareButton onClick={() => setDeviceToEdit(device)} className="text-brand-500">
                      EDIT
                    </BareButton>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </div>
    </PageContainer>
  );
};

const statusColor: Record<DevicesStatus, BadgeProps['color']> = {
  [DevicesStatus.ONLINE]: 'success',
  [DevicesStatus.MAINTENANCE]: 'warning',
  [DevicesStatus.OFFLINE]: 'grey',
};
