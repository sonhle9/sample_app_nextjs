import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  EditIcon,
  JsonPanel,
  Modal,
  ModalHeader,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useRouter} from 'src/react/routing/routing.context';
import {useDeleteSnapshotReportConfig, useSnapshotReportConfig} from '../snapshot-reports.queries';
import {SnapshotReportsForm} from './snapshot-reports-form';

export interface ISnapshotReportConfigDetailsProps {
  id: string;
}

export const SnapshotReportsDetails = (props: ISnapshotReportConfigDetailsProps) => {
  const {data} = useSnapshotReportConfig(props.id);
  const router = useRouter();
  const cancelDeleteBtnRef = React.useRef<HTMLButtonElement>(null);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const dismissEditForm = () => setShowEditForm(false);
  const dismissDeleteDialog = () => setShowDeleteDialog(false);

  const {mutate: remove, isLoading: isDeleting} = useDeleteSnapshotReportConfig(props.id);
  return (
    <PageContainer
      heading="Snapshot reports details"
      action={
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowDeleteDialog(true)} variant="error">
            DELETE
          </Button>
          <Button onClick={() => setShowEditForm(true)} leftIcon={<EditIcon />} variant="primary">
            EDIT
          </Button>
        </div>
      }>
      <Modal isOpen={showEditForm} aria-label="Update report config" onDismiss={dismissEditForm}>
        <ModalHeader>Edit snapshot report config</ModalHeader>
        {data && showEditForm && (
          <SnapshotReportsForm
            onSuccess={dismissEditForm}
            onCancel={dismissEditForm}
            currentSnapshotReportConfig={data}
          />
        )}
      </Modal>
      {showDeleteDialog && (
        <Dialog
          isOpen={showDeleteDialog}
          onDismiss={dismissDeleteDialog}
          leastDestructiveRef={cancelDeleteBtnRef}
          data-testid="delete-dialog">
          <DialogContent header="Are you sure you want to delete this snapshot report config?">
            <p>The snapshot report config will be deleted.</p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={dismissDeleteDialog} ref={cancelDeleteBtnRef} variant="outline">
              CANCEL
            </Button>
            <Button
              onClick={() =>
                remove(undefined, {
                  onSuccess: () => {
                    dismissDeleteDialog();
                    router.navigateByUrl('/snapshot-reports');
                  },
                })
              }
              variant="error"
              isLoading={isDeleting}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <JsonPanel className="mb-6" defaultOpen allowToggleFormat json={data as any} />
    </PageContainer>
  );
};
