import {
  Alert,
  Button,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Modal,
  ModalHeader,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useSnapshotReportConfigs} from '../snapshot-reports.queries';
import {SnapshotReportsForm} from './snapshot-reports-form';

export const SnapshotReportsListing = () => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const dismissCreateForm = () => setShowCreateForm(false);

  const {data, isError, isLoading} = useSnapshotReportConfigs();

  return (
    <PageContainer
      heading="Snapshot reports"
      action={
        <Button variant="primary" leftIcon={<PlusIcon />} onClick={() => setShowCreateForm(true)}>
          CREATE
        </Button>
      }>
      <Modal
        isOpen={showCreateForm}
        aria-label="Create new snapshot report config"
        onDismiss={dismissCreateForm}>
        <ModalHeader>Create new snapshot report config</ModalHeader>
        <SnapshotReportsForm onSuccess={dismissCreateForm} onCancel={dismissCreateForm} />
      </Modal>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable isLoading={isLoading}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Name</Td>
              <Td>Schedule Type</Td>
              <Td>Report Id</Td>
              <Td>Folder Name</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data &&
              data.map((reportConfig) => (
                <Tr
                  key={reportConfig.id}
                  render={(props) => (
                    <Link
                      to={`/snapshot-reports/${reportConfig.id}`}
                      data-testid="snapshot-report-config-record"
                      {...props}
                    />
                  )}>
                  <Td>{reportConfig.reportName}</Td>
                  <Td>{reportConfig.schedule.scheduleType}</Td>
                  <Td>{reportConfig.reportId}</Td>
                  <Td>{reportConfig.folderName}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          {data && data.length === 0 && (
            <DataTableCaption>
              <div className="p-6 text-center">No record found.</div>
            </DataTableCaption>
          )}
        </DataTable>
      )}
    </PageContainer>
  );
};
