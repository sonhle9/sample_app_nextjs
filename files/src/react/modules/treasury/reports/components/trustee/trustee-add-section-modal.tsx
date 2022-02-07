import {
  BareButton,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
} from '@setel/portal-ui';
import * as React from 'react';
import {ISummary} from '../../../../../../app/ledger/ledger.interface';
import {ConfirmDialog} from '../../../../attribution/components/attribution-form';
import {useUpdateReport} from '../../treasury-reports.queries';
import {ItemCard, UpdateTypes} from './trustee-item-card';

interface ITrusteeAddSectionModalProps {
  visible: boolean;
  onClose?: () => void;
  reportId: string;
  summary: ISummary;
  sectionIndex?: number;
}

export const TrusteeAddSectionModal = ({
  visible,
  onClose,
  reportId,
  summary,
  sectionIndex,
}: ITrusteeAddSectionModalProps) => {
  const isUpdate = sectionIndex || sectionIndex === 0;
  const isIndexExist = isUpdate && summary.sections.length >= sectionIndex + 1;
  const initialValues = isIndexExist
    ? summary.sections[sectionIndex]
    : {description: '', fields: [{description: '', amount: ''}]};
  const [sectionDescription, setSectionDescription] = React.useState(initialValues.description);
  const [isDeleteOpen, setDelete] = React.useState(false);
  const {mutate: updateSummary, isLoading} = useUpdateReport(reportId);
  const [section, setSection] = React.useState(Object.assign({}, initialValues));
  const [showError, setShowError] = React.useState(false);

  const saveSection = () => {
    section.description = sectionDescription;
    const updatedSummary = Object.assign({}, summary);
    isUpdate
      ? (updatedSummary.sections[sectionIndex] = section)
      : updatedSummary.sections.push(section);
    updateSummary(
      {summary: {...updatedSummary}},
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          console.log(err);
          setShowError(true);
        },
      },
    );
  };

  const handleUpdate = (type: UpdateTypes, index: number, val?: string) => {
    if (type === UpdateTypes.REMOVE) {
      const updatedSection = Object.assign({}, section);
      updatedSection.fields.splice(index, 1);
      setSection(updatedSection);
    } else {
      section.fields[index][type] = val;
      setSection(section);
    }
  };

  const addItem = () => {
    setShowError(false);
    const updatedSection = Object.assign({}, section);
    updatedSection.fields.push({description: '', amount: ''});
    setSection(updatedSection);
  };

  const deleteSection = () => {
    if (isUpdate) {
      const updatedSummary = Object.assign({}, summary);
      updatedSummary.sections.splice(sectionIndex, 1);
      updateSummary(
        {summary: {...updatedSummary}},
        {
          onSuccess: () => {
            setDelete(false);
            onClose();
          },
          onError: (err: any) => {
            setDelete(false);
            console.log(err);
          },
        },
      );
    }
  };

  const title = isUpdate ? 'Edit details' : 'Add Section';

  return (
    <>
      <Modal isOpen={visible} onDismiss={onClose} aria-label={title}>
        <ModalHeader className="text-sm">{title}</ModalHeader>
        <ModalBody>
          <TextField
            className="text-sm"
            required
            label="Section name"
            value={sectionDescription}
            onChangeValue={setSectionDescription}
            layout="vertical"
            placeholder="Enter section name"
          />
          <hr className="w-full" />
          {section.fields.map((field, index) => (
            <ItemCard
              key={`${index}-${field.description}-${field.amount}`}
              index={index}
              description={field.description}
              amount={field.amount?.toString()}
              showError={showError}
              handleUpdate={handleUpdate}
            />
          ))}
          <BareButton onClick={addItem} className="mt-6 text-brand-500">
            ADD ITEM
          </BareButton>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-between">
            <div>
              {isUpdate && (
                <BareButton onClick={() => setDelete(true)} className="text-error-500">
                  DELETE
                </BareButton>
              )}
            </div>
            <div>
              <Button variant="outline" onClick={onClose}>
                CANCEL
              </Button>
              <Button isLoading={isLoading} variant="primary" onClick={saveSection}>
                {isUpdate ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {isUpdate && (
        <ConfirmDialog
          header={`Are you sure you want to delete this section?`}
          confirmLabel={'DELETE'}
          confirmElement={
            <Button
              variant="error"
              onClick={deleteSection}
              data-testid="btn-confirm-delete"
              isLoading={isLoading}>
              DELETE
            </Button>
          }
          open={isDeleteOpen}
          toggleOpen={setDelete}>
          {'This action cannot be undone and you will not be able to recover any data.'}
        </ConfirmDialog>
      )}
    </>
  );
};
