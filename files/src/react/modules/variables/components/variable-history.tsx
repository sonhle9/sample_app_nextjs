import * as React from 'react';
import {useVariableHistory} from '../variables.queries';
import {
  Alert,
  AlertMessages,
  CardHeading,
  DataTable as Table,
  DataTableCell as Cell,
  DataTableRow as Row,
  DataTableRowGroup as RowGroup,
  formatDate,
  JsonViewer,
  Modal,
  ModalHeader,
  PaginationNavigation,
  usePaginationState,
} from '@setel/portal-ui';

export function VariableHistory({id}: {id: string}) {
  const pagination = usePaginationState();
  const {
    data: history,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useVariableHistory(id, {
    currentPage: pagination.page,
    pageSize: pagination.perPage,
  });
  const [selected, setSelected] = React.useState<number>(null);

  return (
    <>
      {isError ? (
        <Alert variant="error" description="Something went wrong">
          <AlertMessages messages={[error.toString()]} />
        </Alert>
      ) : (
        <Table
          heading={<CardHeading title="History" />}
          isLoading={isLoading}
          pagination={
            isSuccess && (
              <PaginationNavigation
                total={history.metadata.totalCount}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <RowGroup groupType="thead">
            <Row>
              <Cell>User</Cell>
              <Cell>Event name</Cell>
              <Cell>Comment</Cell>
              <Cell>Updated on</Cell>
              <Cell></Cell>
            </Row>
          </RowGroup>
          <RowGroup>
            {isSuccess &&
              history.data.map((event, i) => (
                <Row key={event.createdAt} data-testid={`row-${event.createdAt}`}>
                  <Cell>
                    <a href={`/admin-users/${event.updatedBy}`} target="_blank" className="inline">
                      {event.updatedBy}
                    </a>
                  </Cell>
                  <Cell>{event.eventName}</Cell>
                  <Cell>{event.comment}</Cell>
                  <Cell>
                    {formatDate(new Date(event.createdAt * 1000), {formatType: 'dateAndTime'})}
                  </Cell>
                  <Cell className="text-right">
                    <a
                      href="#"
                      className="inline uppercase text-brand-500 font-semibold text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelected(i);
                      }}
                      data-testid={`details-${event.createdAt}`}>
                      Details
                    </a>
                  </Cell>
                </Row>
              ))}
          </RowGroup>
        </Table>
      )}

      <Modal
        isOpen={selected !== null}
        aria-label="Selected History Details"
        onDismiss={() => setSelected(null)}>
        <ModalHeader>JSON</ModalHeader>
        {selected !== null && (
          <div data-testid="json-viewer">
            <JsonViewer json={JSON.parse(JSON.stringify(history.data[selected].variable))} />
          </div>
        )}
      </Modal>
    </>
  );
}
