import {
  Badge,
  Modal,
  Button,
  Card,
  DescList,
  EditIcon,
  formatDate,
  JsonPanel,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {maintenanceRole} from 'src/shared/helpers/roles.type';
import {statusColor, statusLabel} from '../app-version.const';
import {useAppVersionDetails} from '../app-version.queries';
import {AppVersionForm} from './app-version-form';

export const AppVersionDetails = (props: {id: string}) => {
  const {data, isLoading} = useAppVersionDetails(props.id);
  const hasEditPermission = useHasPermission([maintenanceRole.maintenanceVersionUpdate]);

  const [showEditModal, setShowEditModal] = React.useState(false);
  const dismissEditModal = () => setShowEditModal(false);

  return (
    <PageContainer
      heading="App version details"
      action={
        hasEditPermission && (
          <Button onClick={() => setShowEditModal(true)} variant="outline" leftIcon={<EditIcon />}>
            EDIT
          </Button>
        )
      }>
      <Modal header="Edit App Version" isOpen={showEditModal} onDismiss={dismissEditModal}>
        {showEditModal && data && <AppVersionForm onDismiss={dismissEditModal} current={data} />}
      </Modal>
      <div className="space-y-8">
        <Card>
          <Card.Heading title="General" />
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item label="Version" value={data && data.version} />
              <DescList.Item label="Platform" value={data && data.platform} />
              <DescList.Item
                label="Status"
                value={
                  data && (
                    <Badge color={statusColor[data.status]} className="uppercase">
                      {statusLabel[data.status] || data.status}
                    </Badge>
                  )
                }
              />
              <DescList.Item label="Release date" value={data && formatDate(data.releaseDate)} />
              <DescList.Item label="Created at" value={data && formatDate(data.createdAt)} />
            </DescList>
          </Card.Content>
        </Card>
        <JsonPanel json={data || ({} as any)} allowToggleFormat />
      </div>
    </PageContainer>
  );
};
