import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  EditIcon,
  EyeShowIcon,
  JsonPanel,
  Modal,
  ModalBody,
  ModalHeader,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useRouter} from 'src/react/routing/routing.context';
import {useDeleteOnDemandReportConfig, useOnDemandReportConfig} from '../on-demand-reports.queries';
import {OnDemandReportDataViewer} from './on-demand-report-data-viewer';
import {OnDemandReportsForm} from './on-demand-reports-form';

export interface IOnDemandReportConfigDetailsProps {
  id: string;
}

export const OnDemandReportsDetails = (props: IOnDemandReportConfigDetailsProps) => {
  const {data} = useOnDemandReportConfig(props.id);
  const router = useRouter();
  const cancelDeleteBtnRef = React.useRef<HTMLButtonElement>(null);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const dismissEditForm = () => setShowEditForm(false);
  const dismissDeleteDialog = () => setShowDeleteDialog(false);
  const [showDataPreview, setShowDataPreview] = React.useState(false);

  const {mutate: remove, isLoading: isDeleting} = useDeleteOnDemandReportConfig(props.id);
  return (
    <PageContainer
      heading="On demand reports details"
      action={
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowDeleteDialog(true)} variant="error">
            DELETE
          </Button>
          <Button
            onClick={() => setShowDataPreview(true)}
            leftIcon={<EyeShowIcon />}
            variant="outline">
            PREVIEW
          </Button>
          <Button onClick={() => setShowEditForm(true)} leftIcon={<EditIcon />} variant="primary">
            EDIT
          </Button>
        </div>
      }>
      <Modal isOpen={showEditForm} aria-label="Update report config" onDismiss={dismissEditForm}>
        <ModalHeader>Edit report config</ModalHeader>
        <OnDemandReportsForm
          currentOnDemandReportConfig={data}
          onSuccess={() => {
            dismissEditForm();
            setShowDataPreview(false);
          }}
          onCancel={dismissEditForm}
        />
      </Modal>
      {showDeleteDialog && (
        <Dialog
          isOpen={showDeleteDialog}
          onDismiss={dismissDeleteDialog}
          leastDestructiveRef={cancelDeleteBtnRef}
          data-testid="delete-dialog">
          <DialogContent header="Are you sure you want to delete this on demand report config?">
            <p>The On demand report config will be deleted.</p>
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
                    router.navigateByUrl('/on-demand-reports');
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
      <Modal
        aria-label="Preview Report"
        isOpen={showDataPreview}
        onDismiss={() => setShowDataPreview(false)}>
        <ModalHeader>Preview</ModalHeader>
        <ModalBody>
          {data && (
            <OnDemandReportDataViewer
              reportName={data.reportName}
              url={data.url}
              category={data.category}
              pageSize={5}
              staleTime={2000}
            />
          )}
        </ModalBody>
      </Modal>
    </PageContainer>
  );
};
