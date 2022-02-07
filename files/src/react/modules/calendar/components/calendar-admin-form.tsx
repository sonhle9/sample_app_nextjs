import {Button, ModalBody, ModalFooter, TextField} from '@setel/portal-ui';
import * as React from 'react';
import {useCreateCalendar} from '../calendars.queries';
import {IPublicCalendar} from '../calendars.type';

export interface ICalendarAdminFormProps {
  // currentGLParameter?: IGeneralLedgerParameter;
  onSuccess: (result: IPublicCalendar) => void;
  onCancel: () => void;
}

export const CalendarAdminForm = ({
  // currentGLParameter,
  onSuccess,
  onCancel,
}: ICalendarAdminFormProps) => {
  const {mutate: create, isLoading} = useCreateCalendar();

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        create(
          {
            name,
            description,
          },
          {onSuccess: onSuccess},
        );
      }}>
      <ModalBody>
        <TextField
          label="Calendar name"
          value={name}
          onChangeValue={setName}
          layout="horizontal-responsive"
          className="sm:w-60"
          required
        />
        <TextField
          label="Calendar description"
          value={description}
          onChangeValue={setDescription}
          layout="horizontal-responsive"
          className="sm:w-60"
          required
        />
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={onCancel} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} type="submit" variant="primary">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};
