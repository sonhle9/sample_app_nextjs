import {Button, Modal, MultiInputField} from '@setel/portal-ui';
import * as React from 'react';

import {useCreateTags, useUpdateTags} from '../../customers.queries';

import {IUserProfile} from '../../../../services/api-accounts.service';

export interface IUpdateTagsModalProps {
  onDismiss: () => void;
  data: IUserProfile;
  customerId: string;
}

export const UpdateTagsModal = ({onDismiss, data, customerId}: IUpdateTagsModalProps) => {
  const [tags, setTags] = React.useState(data.tags);
  const [error, setError] = React.useState('');

  const generateHelpText = (input: string): string => {
    const lengthError = input.length > 25 ? 'Tag length must be less or equal 25 characters ' : '';
    const tagError =
      input && !/^[a-z0-9_\-]+$/.test(input) ? `Tag must contain only a-z, 0-9, -, _ ` : '';
    const duplicateError = tags.includes(input) ? 'Tag already exists ' : '';
    return lengthError + tagError + duplicateError;
  };
  const validateTagInput = (input: string): boolean => {
    //update helpText
    const helpText = generateHelpText(input);
    setError(helpText);
    return !helpText;
  };

  const {mutate: updateTags, isLoading: isUpdatingTags} = useUpdateTags();
  const {mutate: createTags} = useCreateTags();
  const submitForm = (): void => {
    if (data) {
      updateTags(
        {userId: customerId, tags},
        {
          onSuccess: () => {
            onDismiss();
          },
        },
      );
    } else {
      createTags(
        {userId: customerId, tags},
        {
          onSuccess: () => {
            onDismiss();
          },
        },
      );
    }
  };

  return (
    <Modal isOpen header="Edit tag" data-testid="customer-update-tags-modal" onDismiss={onDismiss}>
      <Modal.Body>
        <MultiInputField
          layout="horizontal-responsive"
          label="Tags"
          values={tags}
          data-testid="customer-tags-multi-input"
          helpText={error}
          status={error ? 'error' : undefined}
          onChangeValues={setTags}
          validateBeforeAdd={(value) => validateTagInput(value)}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => validateTagInput(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button variant="outline" className="mr-2" onClick={onDismiss}>
          CANCEL
        </Button>
        <Button
          variant="primary"
          isLoading={isUpdatingTags}
          data-testid="submit-btn"
          onClick={submitForm}>
          SAVE CHANGES
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
