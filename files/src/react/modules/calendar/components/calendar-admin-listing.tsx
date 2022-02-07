import {
  Alert,
  Badge,
  DataTableCell as Td,
  DataTableRow as Tr,
  // Button,
  DataTable,
  DataTableRowGroup,
  Filter,
  FilterControls,
  PaginationNavigation,
  SearchTextInput,
  useFilter,
  usePaginationState,
  ModalHeader,
  Modal,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {usePublicCalendarListing} from '../calendars.queries';
import {CalendarAdminForm} from './calendar-admin-form';

export const CalendarAdminListing = () => {
  const [{values, applied}, {setValueCurry, reset}] = useFilter({
    searchKey: '',
  });
  const pagination = usePaginationState();

  const {
    data: resolvedData,
    isLoading,
    isError,
  } = usePublicCalendarListing({
    page: pagination.page,
    perPage: pagination.perPage,
    searchKey: values.searchKey,
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const dismissCreateForm = () => setShowCreateForm(false);

  return (
    <PageContainer heading="Calendars">
      <Modal isOpen={showCreateForm} aria-label="Create new calendar" onDismiss={dismissCreateForm}>
        <ModalHeader>Create new calendar</ModalHeader>
        <CalendarAdminForm onSuccess={dismissCreateForm} onCancel={dismissCreateForm} />
      </Modal>
      <div className="mb-8 space-y-8">
        <FilterControls>
          <SearchTextInput
            value={values.searchKey}
            onChangeValue={setValueCurry('searchKey')}
            wrapperClass="flex-1 sm:col-span-2"
          />
        </FilterControls>
        {applied.length > 0 && (
          <Filter onReset={reset}>
            {applied.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}
      </div>
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          isLoading={isLoading}
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Name</Td>
              <Td>Description</Td>
              <Td>Id</Td>
              <Td>Created at</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((parameter) => (
                <Tr
                  key={parameter.id}
                  render={(props) => (
                    <a
                      href={`/calendars/${parameter.id}`}
                      target="_BLANK"
                      data-testid="calendar-record"
                      {...props}
                    />
                  )}>
                  <Td>{parameter.name}</Td>
                  <Td>{parameter.description}</Td>
                  <Td>{parameter.id}</Td>
                  <Td>{parameter.createdAt}</Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </PageContainer>
  );
};
