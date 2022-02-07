import {
  Button,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Dialog,
  DialogContent,
  DialogFooter,
  EditIcon,
  formatDate,
  Modal,
  ModalHeader,
  PaginationNavigation,
  PlusIcon,
  titleCase,
  TrashIcon,
  usePaginationState,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {usePublicCalendarHolidays, useRemoveHoliday} from '../calendars.queries';
import {IPublicHoliday} from '../calendars.type';
import {CalendarAdminHolidayForm} from './calendar-admin-holiday-form';

type CalendarAdminDetailsProps = {
  id: string;
};

export const CalendarAdminDetails = (props: CalendarAdminDetailsProps) => {
  const pagination = usePaginationState();
  const {data} = usePublicCalendarHolidays(props.id, pagination);

  const [selectedHolidayData, setSelectedHolidayData] = React.useState<IPublicHoliday>(null);
  const clearSelectedHolidayData = () => setSelectedHolidayData(null);
  const [showRemoveHolidayDialog, setShowRemoveHolidayDialog] = React.useState(false);
  const cancelRemoveBtnRef = React.useRef<HTMLButtonElement>(null);
  const dismissRemoveHolidayDialog = () => setShowRemoveHolidayDialog(false);
  const [showOperationForm, setShowOperationForm] = React.useState<'create' | 'update' | ''>('');
  const dismissCreateForm = () => {
    setShowOperationForm('');
    clearSelectedHolidayData();
  };

  const {mutate: remove, isLoading: isRemoving} = useRemoveHoliday(
    selectedHolidayData ? selectedHolidayData.id : null,
  );

  const onOperation = (holidayData: IPublicHoliday, isDelete: boolean) => {
    setSelectedHolidayData(holidayData);
    isDelete ? setShowRemoveHolidayDialog(true) : setShowOperationForm('update');
  };
  return (
    <PageContainer
      heading={`Calendar details - ${props.id}`}
      // action={
      //   data && (
      //     <div className="flex items-center space-x-3">
      //       <Button onClick={() => setShowRemoveDialog(true)} variant="error">
      //         REMOVE
      //       </Button>
      //     </div>
      //   )
      // }
    >
      <Modal
        isOpen={Boolean(showOperationForm)}
        aria-label={showOperationForm === 'create' ? 'Create a new holiday' : 'Update holiday'}
        onDismiss={dismissCreateForm}>
        <ModalHeader>
          {showOperationForm === 'create' ? 'Create a new holiday' : 'Update holiday'}
        </ModalHeader>
        {showOperationForm ? (
          <CalendarAdminHolidayForm
            onSuccess={dismissCreateForm}
            onCancel={dismissCreateForm}
            calendarId={props.id}
            holidayData={selectedHolidayData}
          />
        ) : null}
      </Modal>
      {showRemoveHolidayDialog && (
        <Dialog
          isOpen={showRemoveHolidayDialog}
          onDismiss={dismissRemoveHolidayDialog}
          leastDestructiveRef={cancelRemoveBtnRef}
          data-testid="remove-dialog">
          <DialogContent header="Are you sure you want to remove this holiday?">
            <p>This holiday will be removed.</p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={dismissRemoveHolidayDialog} ref={cancelRemoveBtnRef} variant="outline">
              CANCEL
            </Button>
            <Button
              onClick={() =>
                remove(undefined, {
                  onSuccess: () => {
                    dismissRemoveHolidayDialog();
                    clearSelectedHolidayData();
                  },
                })
              }
              variant="error"
              isLoading={isRemoving}>
              REMOVE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <DataTable
        heading={
          <div className="flex justify-end items-center p-4">
            <Button
              leftIcon={<PlusIcon />}
              onClick={() => setShowOperationForm('create')}
              variant="primary">
              CREATE
            </Button>
          </div>
        }
        pagination={
          data && (
            <PaginationNavigation
              total={data.total}
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
            <Td>Type</Td>
            <Td>Date</Td>
            <Td>Day number</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {data &&
            data.items.map((parameter) => (
              <Tr key={parameter.id} style={{transform: 'scale(1)'}}>
                <Td>{titleCase(parameter.holidayName)}</Td>
                <Td>{parameter.holidayType}</Td>
                <Td>{formatDate(parameter.isoDate, {format: 'dd-MM-yyyy'})}</Td>
                <Td>{parameter.dayNumber}</Td>
                <div
                  className={`flex-row gap-4 flex`}
                  style={{
                    position: 'absolute',
                    right: '2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}>
                  <EditIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onOperation(parameter, false)}
                  />
                  <TrashIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onOperation(parameter, true)}
                  />
                </div>
              </Tr>
            ))}
        </DataTableRowGroup>
      </DataTable>
    </PageContainer>
  );
};
