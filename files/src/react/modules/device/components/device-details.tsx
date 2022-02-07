import {Button, Modal, EditIcon, JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDeviceDetails} from '../device.queries';
import {DeviceForm} from './device-form';

export const DeviceDetails = (props: {id: string}) => {
  const {data} = useDeviceDetails(props.id);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const dismissDialogModal = () => setShowEditModal(false);

  return (
    <PageContainer
      heading="Device Details"
      action={
        data && (
          <Button onClick={() => setShowEditModal(true)} variant="outline" leftIcon={<EditIcon />}>
            EDIT
          </Button>
        )
      }>
      <Modal isOpen={showEditModal} onDismiss={dismissDialogModal} header="Edit Device">
        {data && <DeviceForm current={data} onDismiss={dismissDialogModal} />}
      </Modal>
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};
