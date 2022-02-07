import * as React from 'react';
import {Button, Dialog, DialogContent, DialogFooter} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {IVariable} from '../types';
import {canRemoveVariant, removeVariant} from '../const';
import {useUpdateVariable} from '../variables.queries';

interface IVariableOptionEditProps {
  variable: IVariable;
  variantKey: string;
  children(onTrigger: () => void): JSX.Element;
}

export function VariableOptionDelete({variable, variantKey, children}: IVariableOptionEditProps) {
  const {mutate: updateVariable, isLoading} = useUpdateVariable({
    onSuccess: () => {
      setShowDialog(false);
    },
  });
  const [showDialog, setShowDialog] = React.useState(false);
  const showMessage = useNotification();
  const cancelRef = React.useRef();

  return (
    <>
      {children(() =>
        canRemoveVariant(variable, variantKey)
          ? setShowDialog(true)
          : showMessage({
              variant: 'error',
              title: "Can't delete variable option!",
              description:
                'You cannot delete this variable option because it is being used in Targeting.',
            }),
      )}
      {showDialog && (
        <Dialog leastDestructiveRef={cancelRef} data-testid="dialog">
          <DialogContent header="Are you sure you want to delete this variable option?">
            You are about to delete the variable option <i>{variantKey}</i>. This action cannot be
            undone.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              className="uppercase"
              onClick={() => setShowDialog(false)}
              disabled={isLoading}
              ref={cancelRef}
              data-testid="btn-cancel">
              Cancel
            </Button>
            <Button
              variant="error"
              className="uppercase"
              onClick={() => {
                updateVariable({
                  key: variable.key,
                  variable: removeVariant(variable, variantKey),
                });
              }}
              disabled={isLoading}
              isLoading={isLoading}
              data-testid="btn-confirm">
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
