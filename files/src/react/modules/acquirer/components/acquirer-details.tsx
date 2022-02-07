import {Button, EditIcon, JsonPanel, Modal} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useAcquirerDetails} from '../acquirer.queries';
import {AcquirerForm} from './acquirer-form';

export interface AcquirerDetailsProps {
  id: string;
}

export const AcquirerDetails = (props: AcquirerDetailsProps) => {
  const {data} = useAcquirerDetails(props.id);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const dismissEditModal = () => setShowEditModal(false);

  return (
    <PageContainer
      heading="Acquirer Details"
      action={
        <Button onClick={() => setShowEditModal(true)} variant="outline" leftIcon={<EditIcon />}>
          EDIT
        </Button>
      }>
      <Modal header="Edit Acquirer" isOpen={showEditModal} onDismiss={dismissEditModal}>
        {data && <AcquirerForm current={data} onDismiss={dismissEditModal} />}
      </Modal>
      <JsonPanel json={(data as any) || {}} allowToggleFormat defaultOpen />
    </PageContainer>
  );
};
