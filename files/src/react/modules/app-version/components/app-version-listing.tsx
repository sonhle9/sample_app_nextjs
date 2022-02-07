import {
  Badge,
  Modal,
  BareButton,
  Button,
  DataTable as Table,
  Dialog,
  formatDate,
  PaginationNavigation,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {listMobileVersion} from 'src/react/services/api-maintenance.service';
import {maintenanceRole} from 'src/shared/helpers/roles.type';
import {statusColor, statusLabel} from '../app-version.const';
import {appVersionQueryKeys, useDeleteAppVersion} from '../app-version.queries';
import {AppVersionForm} from './app-version-form';
import {IMobileVersion} from 'src/shared/interfaces/version.interface';
import {useNotification} from 'src/react/hooks/use-notification';

export const AppVersionListing = () => {
  const {
    pagination,
    query: {data, isLoading, isFetching},
  } = useDataTableState({
    queryKey: appVersionQueryKeys.list,
    queryFn: (pagination) => listMobileVersion(pagination),
    initialFilter: {},
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const dismissCreateForm = () => setShowCreateForm(false);

  const [versionToDelete, setVersionToDelete] =
    React.useState<IMobileVersion | undefined>(undefined);
  const dismissDeleteDialog = () => setVersionToDelete(undefined);

  const hasCreatePermission = useHasPermission([maintenanceRole.maintenanceVersionCreate]);
  const hasDeletePermission = useHasPermission([maintenanceRole.maintenanceVersionDelete]);

  return (
    <PageContainer
      heading="App versions"
      action={
        hasCreatePermission && (
          <Button onClick={() => setShowCreateForm(true)} variant="primary" leftIcon={<PlusIcon />}>
            CREATE
          </Button>
        )
      }>
      <Modal header="Create App Version" isOpen={showCreateForm} onDismiss={dismissCreateForm}>
        <AppVersionForm onDismiss={dismissCreateForm} />
      </Modal>
      {versionToDelete && (
        <DeleteVersionConfirmation
          versionToDelete={versionToDelete}
          onDismiss={dismissDeleteDialog}
        />
      )}
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={
          data && (
            <PaginationNavigation
              variant="prev-next"
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
              total={data.pagination.total}
            />
          )
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Platform</Table.Th>
            <Table.Th>Version</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Release date</Table.Th>
            <Table.Th>Created at</Table.Th>
            <Table.Th>Updated at</Table.Th>
            {hasDeletePermission && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data &&
            data.data.length > 0 &&
            data.data.map((version) => (
              <Table.Tr key={version.id}>
                <Table.Td>{version.platform}</Table.Td>
                <Table.Td
                  render={(cellProps) => (
                    <Link {...cellProps} to={`/versions/details/${version.id}`} />
                  )}
                  className="text-brand-500 font-medium">
                  {version.version}
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColor[version.status]} className="uppercase">
                    {statusLabel[version.status] || version.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDate(version.releaseDate)}</Table.Td>
                <Table.Td>{formatDate(version.createdAt)}</Table.Td>
                <Table.Td>{formatDate(version.updatedAt)}</Table.Td>
                {hasDeletePermission && (
                  <Table.Td>
                    <BareButton
                      onClick={() => setVersionToDelete(version)}
                      className="text-error-500">
                      DELETE
                    </BareButton>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </PageContainer>
  );
};

const DeleteVersionConfirmation = (props: {
  versionToDelete: IMobileVersion;
  onDismiss: () => void;
}) => {
  const {mutate, isLoading} = useDeleteAppVersion(props.versionToDelete.id);
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const versionName = `${props.versionToDelete.platform} ${props.versionToDelete.version}`;

  const showMsg = useNotification();

  return (
    <Dialog leastDestructiveRef={cancelBtnRef} onDismiss={props.onDismiss}>
      <Dialog.Content header={`Are you sure you want to delete ${versionName}?`} />
      <Dialog.Footer>
        <Button onClick={props.onDismiss} variant="outline">
          CANCEL
        </Button>
        <Button
          onClick={() =>
            mutate(undefined, {
              onSuccess: () => {
                props.onDismiss();
                showMsg({
                  title: `${versionName} deleted.`,
                });
              },
            })
          }
          isLoading={isLoading}
          variant="error">
          DELETE
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};
