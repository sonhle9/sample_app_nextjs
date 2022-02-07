import {
  Filter,
  FilterControls,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  Alert,
  formatDate,
  IconButton,
  LinkIcon,
  ErrorIcon,
  Button,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {ConfirmDialog} from '../../attribution/components/attribution-form';
import {useAuth} from '../../auth';
import {CACHE_KEYS, useUnlinkDevice, useUpdateDevice} from '../account-device.query';
import {getAccountDevices} from '../account-device.services';
import {AccountDeviceBlacklistModal} from './account-device-backlist-modal';

export const AccountDeviceList = () => {
  const {session} = useAuth();
  const [idDeviceUnlink, setIdDeviceUnlink] = useState(null);
  const [idDeviceBlacklist, setIdDeviceBlacklist] = useState(null);
  const [idDeviceReactivate, setIdDeviceReactivate] = useState(null);
  const {mutate: unlinkDevice} = useUnlinkDevice();
  const {mutate: reactivateDevice} = useUpdateDevice();

  const {
    query: {data: resolvedData, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      range: ['', ''] as [string, string],
      deviceId: '',
      isBlocked: '',
    },
    queryKey: CACHE_KEYS.DeviceListing,
    queryFn: (currentValues) => {
      const {
        range: [from, to],
        ...filter
      } = currentValues;
      return getAccountDevices({from, to, ...filter});
    },
    components: () => [
      {
        key: 'deviceId',
        type: 'search',
        props: {
          label: 'Device Id',
        },
      },
      {
        key: 'isBlocked',
        type: 'select',
        props: {
          options: BLACK_LIST_OPTIONS,
          label: 'Is device blocked',
        },
      },
      {
        key: 'range',
        type: 'daterange',
        props: {
          label: 'Created Date',
        },
      },
    ],
  });

  return (
    <PageContainer heading="Account devices">
      <div className="my-8 space-y-8">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <>
          <DataTable
            isLoading={isLoading}
            pagination={
              resolvedData && (
                <PaginationNavigation
                  total={resolvedData.items['pagination'].total}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  onChangePage={pagination.setPage}
                  onChangePageSize={pagination.setPerPage}
                />
              )
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Device Id</Td>
                <Td>User Id</Td>
                <Td>Status</Td>
                <Td>Remark</Td>
                <Td>Created at</Td>
                <Td></Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {resolvedData &&
                resolvedData.items['data'].map((accountDevice, index) => (
                  <Tr
                    key={index}
                    render={(props) => (
                      <Link
                        {...props}
                        to={`risk-controls/account-devices/listing/${accountDevice.id}`}
                      />
                    )}>
                    <Td>{accountDevice.deviceId}</Td>
                    <Td>{accountDevice.userId}</Td>
                    <Td>{accountDevice.isBlocked ? 'Blacklisted' : 'Active'}</Td>
                    <Td>{accountDevice.remark}</Td>
                    <Td>{formatDate(accountDevice.createdAt)}</Td>
                    <Td>
                      <IconButton onClick={() => setIdDeviceUnlink(accountDevice.id)}>
                        <LinkIcon className="w-5 h-5 mr-3" />
                      </IconButton>
                      {accountDevice.isBlocked ? (
                        <IconButton onClick={() => setIdDeviceReactivate(accountDevice.deviceId)}>
                          <ErrorIcon className="w-5 h-5 text-gray-500" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => setIdDeviceBlacklist(accountDevice.deviceId)}>
                          <ErrorIcon className="w-5 h-5 text-red-500" />
                        </IconButton>
                      )}
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
          </DataTable>
          <ConfirmDialog
            header={`Are you sure you want to unlink the following device?`}
            confirmLabel={'CONFIRM'}
            confirmElement={
              <Button
                variant="error"
                onClick={() =>
                  unlinkDevice(
                    {deviceId: idDeviceUnlink, adminUsername: session?.sub},
                    {onSuccess: () => setIdDeviceUnlink(null)},
                  )
                }
                isLoading={isLoading}>
                CONFIRM
              </Button>
            }
            toggleOpen={setIdDeviceUnlink}
            open={idDeviceUnlink}>
            {idDeviceUnlink}
          </ConfirmDialog>
          <ConfirmDialog
            header={`Are you sure you want to reactivate this device?`}
            confirmLabel={'CONFIRM'}
            confirmElement={
              <Button
                variant="error"
                onClick={() =>
                  reactivateDevice(
                    {
                      deviceId: idDeviceReactivate,
                      deviceRemark: {adminUsername: session?.sub, isBlocked: false, remark: ''},
                    },
                    {onSuccess: () => setIdDeviceReactivate(null)},
                  )
                }
                isLoading={isLoading}>
                CONFIRM
              </Button>
            }
            toggleOpen={setIdDeviceReactivate}
            open={idDeviceReactivate}>
            {idDeviceReactivate}
          </ConfirmDialog>
          {idDeviceBlacklist && (
            <AccountDeviceBlacklistModal
              deviceId={idDeviceBlacklist}
              close={() => setIdDeviceBlacklist(null)}
            />
          )}
        </>
      )}
    </PageContainer>
  );
};

const BLACK_LIST_OPTIONS = [
  {
    label: 'None',
    value: '',
  },
  {
    label: 'Blacklisted',
    value: 'true',
  },
  {
    label: 'Not Blacklisted',
    value: 'false',
  },
];
