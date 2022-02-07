import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FieldContainer,
  TextareaField,
  DropdownSelectField,
  Button,
  formatDate,
} from '@setel/portal-ui';
import {useOptOutProgrammes, useGetMemberProgrammesByCode} from '../../loyalty.queries';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {OptInOptions, OptInOptionsName} from '../../loyalty-access.type';
import cn from 'classnames';

const DEFAULT_PROGRAMME_CODE = 'axxess';

type LoyaltyProgrammeModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  memberId: string;
};

const options = [
  {
    label: OptInOptionsName.get(OptInOptions.OPT_IN).name,
    value: OptInOptions.OPT_IN as string,
    disabled: true,
  },
  {
    label: OptInOptionsName.get(OptInOptions.OPT_OUT).name,
    value: OptInOptions.OPT_OUT as string,
  },
];

export const LoyaltyProgrammeModal: React.VFC<LoyaltyProgrammeModalProps> = ({
  isOpen,
  onDismiss,
  memberId,
}) => {
  const [optOption, setOptOption] = React.useState<string | number | string[]>(
    OptInOptions.OPT_OUT as string,
  );
  const [optOutReason, setOptOutReason] = React.useState('');
  const {mutateAsync: mutateOptOut, isError, error} = useOptOutProgrammes();
  const {data} = useGetMemberProgrammesByCode({memberId, code: DEFAULT_PROGRAMME_CODE});

  React.useEffect(() => {
    setOptOutReason('');
  }, [optOption]);

  const handleDismiss = () => {
    setOptOption(OptInOptions.OPT_OUT);
    setOptOutReason('');
    onDismiss();
  };

  const handleSubmit = async () => {
    let res;

    if (optOption === OptInOptions.OPT_OUT) {
      res = await mutateOptOut({memberId, code: DEFAULT_PROGRAMME_CODE});
    }

    res && handleDismiss();
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      data-testid="programme-modal"
      aria-label="change-programme-opt-in">
      <ModalHeader>Programme</ModalHeader>
      <ModalBody>
        {isError && (
          <div className="pb-4">
            <QueryErrorAlert
              error={(error as any) || null}
              description="Error while opting programme"
            />
          </div>
        )}
        <FieldContainer label="Programme" layout="horizontal-responsive" labelAlign="start">
          <div className="sm:pt-2.5 text-sm">AXXESS (PA)</div>
        </FieldContainer>
        <DropdownSelectField
          label={
            <>
              Opt <sup className="text-error-500">*</sup>
            </>
          }
          layout="horizontal-responsive"
          labelAlign="start"
          className={cn('w-64 -mb-5', OptInOptionsName.get(optOption as OptInOptions).className)}
          options={options}
          value={optOption}
          onChangeValue={setOptOption}
        />
        <FieldContainer label="Opt in on" layout="horizontal-responsive" labelAlign="start">
          <div className="sm:pt-2.5 text-sm">
            {data?.optInDate ? formatDate(data.optInDate) : '-'}
          </div>
        </FieldContainer>
        <TextareaField
          label="Opt out reason"
          layout="horizontal-responsive"
          labelAlign="start"
          className="-mb-2.5"
          value={optOutReason}
          onChangeValue={setOptOutReason}
          disabled={optOption === OptInOptions.OPT_IN}
          placeholder="State reason"
        />
        <FieldContainer
          label="Opt out on"
          layout="horizontal-responsive"
          labelAlign="start"
          className="mb-2.5">
          <div className="sm:pt-2.5 text-sm">
            {data?.optOutAt ? formatDate(data.optOutAt) : '-'}
          </div>
        </FieldContainer>
        <FieldContainer
          label="Points retained"
          layout="horizontal-responsive"
          labelAlign="start"
          className="mb-2.5">
          <div className="sm:pt-2.5 text-sm">{data?.pointsRetained || '-'} pts</div>
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right">
        <Button variant="outline" className="mr-5" onClick={handleDismiss}>
          CANCEL
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </Modal>
  );
};
