import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FieldContainer,
  TextField,
  TextareaField,
  OptionsOrGroups,
  DropdownSelect,
  FileSelector,
  FileItem,
  Button,
  isNil,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {AdjustmentTypes, AdjustmentTypesName} from '../../points.type';
import {Member, ValidFileTypes} from '../../loyalty-members.type';
import {useAdjustPoints} from '../../loyalty.queries';

const FILE_SIZE_LIMIT = 10000000;

type LoyaltyMemberPointAdjustmentModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
};

export const LoyaltyMemberPointAdjustmentModal: React.VFC<LoyaltyMemberPointAdjustmentModalProps> =
  ({isOpen, onDismiss, member}) => {
    const [amount, setAmount] = React.useState<number | null>(null);
    const [adjustmentType, setAdjustmentType] = React.useState(undefined);
    const [remarks, setRemarks] = React.useState<string | null>(null);
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const {mutateAsync: mutateAdjustPoints, isLoading, isError, error, reset} = useAdjustPoints();

    const isValidFile = React.useMemo(
      () =>
        file
          ? Object.values(ValidFileTypes).includes(file.type as ValidFileTypes) &&
            file.size <= FILE_SIZE_LIMIT
          : true,
      [file],
    );

    const options: OptionsOrGroups<AdjustmentTypes | string> = Object.values(AdjustmentTypes).map(
      (value) => ({
        label: AdjustmentTypesName.get(value),
        value,
      }),
    );

    const handleAmount = (val: string) => {
      if (Number(val) < 0) {
        setAmount(Number(val) * -1);
      } else if (val === '') {
        setAmount(null);
      } else {
        setAmount(Number(val));
      }
    };

    const onReset = () => {
      setAmount(null);
      setAdjustmentType(undefined);
      setRemarks(null);
      setFile(undefined);
      reset();
    };

    const handleDismiss = () => {
      onReset();
      onDismiss();
    };

    const handleSubmit = async () => {
      const res = await mutateAdjustPoints({
        amount,
        adjustmentType: adjustmentType as AdjustmentTypes,
        remarks,
        cardNumber: member?.cardNumber,
        file,
      });

      if (res) {
        handleDismiss();
      }
    };

    return (
      <Modal
        isOpen={isOpen}
        onDismiss={handleDismiss}
        aria-label="Point adjustment"
        data-testid="point-adjustment-modal">
        <ModalHeader>Point adjustment</ModalHeader>
        <ModalBody>
          {isError && (
            <div className="pb-4 col-span-3">
              <QueryErrorAlert error={error as any} description="Error while adjusting points" />
            </div>
          )}
          <FieldContainer
            label="Amount"
            layout="horizontal-responsive"
            className="mb-0"
            labelAlign="start">
            <div className="relative mb-5 w-48">
              <TextField
                type="number"
                value={isNil(amount) ? '' : amount}
                onChangeValue={handleAmount}
                placeholder="0"
                data-testid="amount-input"
              />
              <div className="absolute inset-y-0 right-0 px-2 my-1 mr-1 bg-white h-8 flex items-center">
                pts
              </div>
            </div>
          </FieldContainer>
          <FieldContainer label="Adjustment type" layout="horizontal-responsive" labelAlign="start">
            <DropdownSelect
              value={adjustmentType}
              className="w-60"
              onChangeValue={setAdjustmentType}
              placeholder="Please select"
              options={options}
              data-testid="adjustment-type"
            />
          </FieldContainer>
          <FieldContainer
            label="Remark"
            layout="horizontal-responsive"
            className="mb-0"
            labelAlign="start">
            <TextareaField value={isNil(remarks) ? '' : remarks} onChangeValue={setRemarks} />
          </FieldContainer>
          <FieldContainer
            label="Attachment"
            layout="horizontal-responsive"
            className="mb-0"
            labelAlign="start">
            <>
              {file && !isValidFile && (
                <div className="pb-2.5">
                  <QueryErrorAlert
                    error={'Select PNG,JPG,PDF or Docs up to 10MB' as any}
                    description={'Invalid File'}
                  />
                </div>
              )}
              {file ? (
                <FileItem fileName={file.name} onRemove={() => setFile(undefined)} />
              ) : (
                <FileSelector
                  onFilesSelected={(files) => setFile(files[0])}
                  file={file}
                  description="PNG,JPG,PDF,Docs up to 10MB"
                />
              )}
            </>
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button variant="outline" className="mr-5" onClick={handleDismiss}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            isLoading={isLoading}
            disabled={!amount || !adjustmentType || !isValidFile}
            onClick={handleSubmit}>
            SUBMIT FOR APPROVAL
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
