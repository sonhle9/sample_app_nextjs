import {
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  MultiInputWithSuggestions,
  useDebounce,
} from '@setel/portal-ui';
import React from 'react';
import {useQuery} from 'react-query';
import {getAdminTags} from '../../../services/api-orders.service';
import {ADMIN_TAGS_QUERY_KEY, useEditTags} from '../fuel-orders.queries';

interface EditTagsModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  existingTags: string[];
  orderId: string;
}

export function EditTagsModal({orderId, isOpen, onDismiss, existingTags}: EditTagsModalProps) {
  const [selectedTags, setSelectedTags] = React.useState(existingTags);
  const [inputValue, setInputValue] = React.useState('');

  const searchKey = useDebounce(inputValue);
  const {mutateAsync: editTags, isLoading} = useEditTags();

  const {data: suggestions} = useQuery([ADMIN_TAGS_QUERY_KEY, searchKey], () =>
    getAdminTags(searchKey),
  );

  const handleDismiss = () => {
    setSelectedTags(existingTags);
    onDismiss();
  };

  return (
    <Modal header="Edit tags" isOpen={isOpen} onDismiss={handleDismiss}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          editTags(
            {orderId, tags: selectedTags},
            {
              onSettled: () => {
                setSelectedTags([...new Set(selectedTags)]);
                onDismiss();
              },
            },
          );
        }}>
        <ModalBody>
          <FieldContainer layout="horizontal" label="Tags">
            <MultiInputWithSuggestions
              values={selectedTags}
              onChangeValues={setSelectedTags}
              suggestions={
                suggestions &&
                suggestions.map((tag) => tag.name).filter((tag) => !selectedTags.includes(tag))
              }
              onInputValueChange={setInputValue}
              placeholder="Please select a tag"
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button onClick={handleDismiss} disabled={isLoading} variant="outline" className="mr-3">
            CANCEL
          </Button>
          <Button variant="primary" isLoading={isLoading} disabled={isLoading} type="submit">
            SAVE CHANGES
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
