import React, {useState} from 'react';
import {
  Button,
  Card,
  CardHeading,
  DataTable,
  DataTableRowGroup,
  PlusIcon,
  DataTableCell as Td,
  DataTableRow as Tr,
  Skeleton,
  Modal,
  Badge,
  BareButton,
} from '@setel/portal-ui';
import {useGetConnectionConfig} from './partner-sftp.queries';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {SftpTargetType} from './partner-sftp.type';
import {SftpConnectionForm} from './sftp-connection-form';
import {useNotification} from 'src/react/hooks/use-notification';

export const SftpConnection = (props: {targetId: string; targetType: SftpTargetType}) => {
  const {data: connections, isLoading} = useGetConnectionConfig(props.targetId, props.targetType);
  const [isOpenSftpForm, setOpenSftpForm] = useState(false);
  const [editConnection, setEditConnection] = useState(null);
  const showMessage = useNotification();

  return (
    <div className="my-8">
      <Card>
        <CardHeading title="SFTP connection">
          {!isLoading && connections?.length > 0 && (
            <Button
              data-testid="create-connection-config"
              onClick={() => {
                setOpenSftpForm(true);
              }}
              variant="outline"
              minWidth="none"
              leftIcon={<PlusIcon />}>
              CREATE
            </Button>
          )}
        </CardHeading>
        <DataTable>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-40 pl-7">CONNECTION ID</Td>
              <Td>IP ADDRESS</Td>
              <Td>STATUS</Td>
              <Td>FOLDER DESTINATION</Td>
              <Td className="text-right pr-8"></Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {isLoading &&
              [1, 2, 3].map((index) => (
                <Tr key={index}>
                  <Td className="pl-7">
                    <Skeleton className="w-48 h-6 float-right rounded animate-pulse" />
                  </Td>
                  <Td>
                    <Skeleton className="w-48 h-6 rounded animate-pulse" />
                  </Td>
                  <Td>
                    <Skeleton className="w-20 h-6 rounded animate-pulse" />
                  </Td>
                  <Td>
                    <Skeleton className="w-48 h-6 rounded animate-pulse" />
                  </Td>
                </Tr>
              ))}
            {connections &&
              connections.map((connection) => (
                <Tr key={connection.id}>
                  <Td className="pl-7">{connection.id}</Td>
                  <Td>
                    {connection.host}:{connection.port}
                  </Td>
                  <Td>
                    <Badge
                      color={connection.isActivated ? 'success' : 'grey'}
                      rounded="rounded"
                      size="small">
                      {connection.isActivated ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </Td>
                  <Td>{connection.destinationFolder}</Td>
                  <Td className="-mt-1 -mb-1 text-right pr-7 align-middle">
                    <BareButton
                      onClick={() => {
                        setEditConnection(connection);
                        setOpenSftpForm(true);
                      }}
                      className="cursor-pointer text-brand-500 font-bold text-right">
                      EDIT
                    </BareButton>
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          {!isLoading && connections?.length === 0 && (
            <EmptyDataTableCaption
              action={
                <Button
                  className="mt-4"
                  onClick={() => setOpenSftpForm(true)}
                  variant="outline"
                  leftIcon={<PlusIcon />}>
                  CREATE
                </Button>
              }
              className="py-8"
            />
          )}
        </DataTable>
        <Modal
          isOpen={isOpenSftpForm}
          onDismiss={() => {
            setEditConnection(null);
            setOpenSftpForm(false);
          }}
          header={editConnection ? 'Edit details' : 'Create new SFTP connection'}>
          <SftpConnectionForm
            targetId={props.targetId}
            targetType={props.targetType}
            onCancel={() => {
              setEditConnection(null);
              setOpenSftpForm(false);
            }}
            onSuccess={(msg?: string) => {
              setEditConnection(null);
              setOpenSftpForm(false);
              if (msg) {
                showMessage({
                  variant: 'success',
                  title: 'Successful!',
                  description: msg,
                });
              }
            }}
            connection={editConnection}
          />
        </Modal>
      </Card>
    </div>
  );
};
