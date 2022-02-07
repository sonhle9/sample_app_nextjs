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
import {useOnDemandReportConfigs} from '../on-demand-reports.queries';
import {OnDemandReportsForm} from './on-demand-reports-form';

export const OnDemandReportsListing = () => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const dismissCreateForm = () => setShowCreateForm(false);

  const {data, isError, isLoading} = useOnDemandReportConfigs();

  return (
    <PageContainer
      heading="On demand reporting"
      action={
        <Button variant="primary" leftIcon={<PlusIcon />} onClick={() => setShowCreateForm(true)}>
          CREATE
        </Button>
      }>
      <Modal
        isOpen={showCreateForm}
        aria-label="Create a new reports config"
        onDismiss={dismissCreateForm}>
        <ModalHeader>Create new report config</ModalHeader>
        <OnDemandReportsForm onSuccess={dismissCreateForm} onCancel={dismissCreateForm} />
      </Modal>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable isLoading={isLoading}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Report Name</Td>
              <Td>Report Description</Td>
              <Td>Report Mapping Count</Td>
              <Td>URL</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data &&
              data.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <a
                      href={`/on-demand-reports/${parameter.id}`}
                      target="_BLANK"
                      data-testid="on-demand-report-config-record"
                      {...props}
                    />
                  )}>
                  <Td>{parameter.reportName}</Td>
                  <Td>{parameter.reportDescription}</Td>
                  <Td>{parameter.reportMappings.length}</Td>
                  <Td>{parameter.url}</Td>
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
