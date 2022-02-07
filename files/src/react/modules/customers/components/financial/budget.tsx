import * as React from 'react';
import {
  Card,
  DataTable as Table,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandRow,
  Button,
  Modal,
  DaySelector,
  FieldContainer,
  usePaginationState,
  Pagination,
} from '@setel/portal-ui';
import {
  useEmailStatementSummaryByUserId,
  useIndexMonthlyStatementSummaryByUserId,
} from '../../customers.queries';
import {useNotification} from 'src/react/hooks/use-notification';
import {ICustomBudget} from 'src/shared/interfaces/customer.interface';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {format} from 'date-fns';

export function CustomerBudget({userId}: {userId: string}) {
  const [isCardExpand, setCardExpand] = React.useState(false);
  const [isCustomStatementModal, setCustomStatementModal] = React.useState(false);
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const {
    data: custBudget,
    isLoading: isLoadingBudget,
    isSuccess: isSuccessBudget,
  } = useIndexMonthlyStatementSummaryByUserId(userId, {page, perPage}, {enabled: isCardExpand});
  return (
    <>
      {isCustomStatementModal && (
        <CustomStatementModal
          userId={userId}
          isOpen={isCustomStatementModal}
          onClose={() => setCustomStatementModal(false)}
        />
      )}
      <Table
        heading={
          <Card.Heading title="Fuel Budget" data-testid="budget-card-heading">
            <Button
              className="ml-3"
              variant="outline"
              data-testid="custom-statement-button"
              minWidth="none"
              onClick={() => setCustomStatementModal((prev) => !prev)}>
              CUSTOM STATEMENT
            </Button>
          </Card.Heading>
        }
        expandable
        isOpen={isCardExpand}
        onToggleOpen={() => setCardExpand((prev) => !prev)}
        isLoading={isLoadingBudget}
        type="primary"
        native
        data-testid="budget-outer-table"
        pagination={
          custBudget?.total > 20 &&
          isCardExpand && (
            <Pagination
              variant="page-list"
              lastPage={Math.min(Math.max(5, page + 2), custBudget?.pageCount)}
              currentPage={page}
              pageSize={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
              onGoToLast={() => setPage(custBudget?.pageCount)}
            />
          )
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="text-left">MONTH</Table.Th>
            <Table.Th className="text-right">TOTAL AMOUNT (RM)</Table.Th>
            <Table.Th className="text-right">TOTAL LITRES (L)</Table.Th>
            <Table.Th className="text-right">TOTAL PURCHASES</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {!isLoadingBudget &&
          custBudget &&
          (custBudget.total ? (
            <Table.Tbody>
              {custBudget &&
                custBudget.items.map((budget) => (
                  <ExpandGroup key={budget._id}>
                    <Table.Tr>
                      <Table.Td>
                        <ExpandButton
                          data-testid={`expand-budget-table-row-button-${budget._id}`}
                        />
                        {format(new Date(0, Number(budget.month), 0), 'MMM')} {budget.year}
                      </Table.Td>
                      <Table.Td className="text-right">
                        {budget.fuelOrders.totals.amountFuelled.toFixed(2)}
                      </Table.Td>
                      <Table.Td className="text-right">
                        {budget.fuelOrders.totals.litresFuelled.toFixed(2)}
                      </Table.Td>
                      <Table.Td className="text-right">
                        {budget.fuelOrders.totals.purchaseCount}
                      </Table.Td>
                    </Table.Tr>
                    <ExpandRow>
                      <div className="-m-5">
                        <Table type="secondary" data-testid="budget-inner-table">
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Td>FUEL TYPE</Table.Td>
                              <Table.Td className="text-right">TOTAL OF FUEL PURCHASE</Table.Td>
                              <Table.Td className="text-right">AMOUNT FUELLED (RM)</Table.Td>
                              <Table.Td className="text-right">LITRES FUELLED</Table.Td>
                            </Table.Tr>
                          </Table.Thead>

                          {isSuccessBudget &&
                            (budget?.fuelOrders?.summaries?.length > 0 ? (
                              <Table.Tbody>
                                {budget.fuelOrders.summaries.map((fuelDetails) => (
                                  <Table.Tr key={fuelDetails._id}>
                                    <Table.Td>{fuelDetails.fuelType}</Table.Td>
                                    <Table.Td className="text-right">
                                      {fuelDetails.purchaseCount}
                                    </Table.Td>
                                    <Table.Td className="text-right">
                                      {fuelDetails.amountFuelled.toFixed(2)}
                                    </Table.Td>
                                    <Table.Td className="text-right">
                                      {fuelDetails.litresFuelled.toFixed(2)}
                                    </Table.Td>
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            ) : (
                              <EmptyDataTableCaption />
                            ))}
                        </Table>
                      </div>
                    </ExpandRow>
                  </ExpandGroup>
                ))}
            </Table.Tbody>
          ) : (
            <EmptyDataTableCaption />
          ))}
      </Table>
    </>
  );
}

function CustomStatementModal({userId, isOpen, onClose}) {
  const {mutate: mutateBudget, isLoading: isLoadingMutateBudget} =
    useEmailStatementSummaryByUserId(userId);
  const [dateInput, setDateInput] = React.useState<ICustomBudget>({
    startDate: undefined,
    endDate: undefined,
    type: 'custom',
  });
  const showMessage = useNotification();
  const isValidForm = !!dateInput.startDate && !!dateInput.endDate;
  const currentDate = new Date();

  function handleSubmit() {
    if (!isValidForm) {
      return;
    }
    mutateBudget(
      {...dateInput},
      {
        onSuccess: () => {
          showMessage({
            title: `Successful!`,
            variant: 'success',
            description: 'Statement has been successfully sent',
          });
          onClose();
        },
        onError: () => {
          showMessage({
            title: 'Error!',
            variant: 'error',
            description: 'Something went wrong!!',
          });
          onClose();
        },
      },
    );
  }

  return (
    <Modal
      data-testid="custom-statement-popout"
      isOpen={isOpen}
      onDismiss={onClose}
      header="Custom Statement">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}>
        <Modal.Body>
          <FieldContainer className="mt-5" label="Start date" layout="horizontal-responsive">
            <DaySelector
              value={dateInput.startDate}
              onChangeValue={(newStartDate) => {
                setDateInput((prev) => ({...prev, startDate: newStartDate}));
              }}
              data-testid="start-date-input"
              maxDate={currentDate}
            />
          </FieldContainer>
          <FieldContainer className="mt-5" label="End date" layout="horizontal-responsive">
            <DaySelector
              value={dateInput.endDate}
              onChangeValue={(newEndDate) => {
                setDateInput((prev) => ({...prev, endDate: newEndDate}));
              }}
              data-testid="end-date-input"
              maxDate={currentDate}
            />
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button onClick={onClose} variant="outline" data-testid="cancel-button">
            CANCEL
          </Button>
          <Button
            className="ml-3"
            type="submit"
            variant="primary"
            isLoading={isLoadingMutateBudget}
            disabled={!isValidForm}
            data-testid="sent-button">
            SENT
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
