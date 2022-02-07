import {Button, EditIcon, JsonPanel, Modal} from '@setel/portal-ui';
import * as React from 'react';
import {JsonEditor} from 'src/react/components/json-editor';
import {PageContainer} from 'src/react/components/page-container';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {experienceAppSettingsRoles} from 'src/shared/helpers/roles.type';
import {IAppSettings} from 'src/shared/interfaces/variables.interface';
import {
  useInterfaceComponentDetails,
  useCreateOrUpdateInterfaceComponent,
} from '../interface-component.queries';

export const InterfaceComponent = () => {
  const {data} = useInterfaceComponentDetails();
  const hasEditPermission = useHasPermission([experienceAppSettingsRoles.manageGlobal]);
  const [showEdit, setShowEdit] = React.useState(false);
  const dismissEdit = () => setShowEdit(false);

  return (
    <PageContainer
      heading="Interface Components"
      action={
        hasEditPermission && (
          <Button onClick={() => setShowEdit(true)} variant="outline" leftIcon={<EditIcon />}>
            EDIT
          </Button>
        )
      }>
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
      {hasEditPermission && data && showEdit && (
        <Modal header="Update variable" size="large" isOpen={showEdit} onDismiss={dismissEdit}>
          <InterfaceComponentEditForm initialValue={data} onDismiss={dismissEdit} />
        </Modal>
      )}
    </PageContainer>
  );
};

const InterfaceComponentEditForm = (props: {initialValue: IAppSettings; onDismiss: () => void}) => {
  const [value, setValue] = React.useState(props.initialValue);
  const [isValid, setIsValid] = React.useState(false);
  const {mutate, isLoading} = useCreateOrUpdateInterfaceComponent();

  return (
    <>
      <Modal.Body>
        <JsonEditor json={value} onChange={setValue} onValidityChange={setIsValid} />
      </Modal.Body>
      <Modal.Footer className="text-right space-x-3">
        <Button onClick={props.onDismiss} variant="outline">
          CANCEL
        </Button>
        <Button
          onClick={() =>
            mutate(value, {
              onSuccess: props.onDismiss,
            })
          }
          isLoading={isLoading}
          variant="primary"
          disabled={!isValid}>
          SAVE
        </Button>
      </Modal.Footer>
    </>
  );
};
