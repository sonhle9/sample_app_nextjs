import {
  BareButton,
  Button,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextareaField,
  TextField,
} from '@setel/portal-ui';
import * as React from 'react';
import {ISummary} from '../../../../../../app/ledger/ledger.interface';
import {useUpdateReport} from '../../treasury-reports.queries';
import {ItemCard, UpdateTypes} from './trustee-item-card';

interface ITrusteeEditPaymentReportModalProps {
  visible: boolean;
  onClose?: () => void;
  reportId: string;
  data: ISummary;
}

export const TrusteeEditPaymentReportModal = ({
  visible,
  onClose,
  reportId,
  data,
}: ITrusteeEditPaymentReportModalProps) => {
  const {mutate: updateReport, isLoading} = useUpdateReport(reportId);
  const [summary, setSummary] = React.useState(data);
  const [showError, setShowError] = React.useState(false);

  const handleUpdate = (type, value) => {
    summary[type] = value;
    setSummary(summary);
  };

  const handleUpdateExtras = (type: UpdateTypes, index: number, val?: string) => {
    if (type === UpdateTypes.REMOVE) {
      const updatedSummary = Object.assign({}, summary);
      updatedSummary.extras.splice(index, 1);
      setSummary(updatedSummary);
    } else {
      summary.extras[index][type] = val;
      setSummary(summary);
    }
  };

  const addItem = () => {
    setShowError(false);
    const updatedSummary = Object.assign({}, summary);
    updatedSummary.extras.push({description: '', amount: ''});
    setSummary(updatedSummary);
  };

  const saveReport = () => {
    const totalExtras = summary.extras.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalWithdrawal = Number(summary.payables) + Number(summary.refunds) + totalExtras;
    summary.withdrawals = totalWithdrawal.toFixed(2);
    updateReport(
      {summary},
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

  return (
    <>
      <Modal isOpen={visible} onDismiss={onClose} aria-label="Edit report">
        <ModalHeader>Edit report</ModalHeader>
        <ModalBody>
          <TextField
            className="text-sm"
            disabled={true}
            required
            label="Section name"
            value="Daily payment report"
            layout="vertical"
          />
          <hr className="w-full" />
          <ReportItem
            index={0}
            description="Total payment amount to merchants / dealers"
            amount={summary.payables.toString()}
            type="payables"
            handleUpdate={handleUpdate}
          />
          <ReportItem
            index={1}
            description="Total refund amount to users"
            amount={summary.refunds.toString()}
            type="refunds"
            handleUpdate={handleUpdate}
          />
          {summary.extras.map((extra, index) => (
            <ItemCard
              key={`${index}-${extra.description}-${extra.amount}`}
              index={index}
              indexOffset={3}
              description={extra.description}
              amount={extra.amount?.toString()}
              showError={showError}
              handleUpdate={handleUpdateExtras}
            />
          ))}
          <BareButton onClick={addItem} className="text-brand-500">
            ADD ITEM
          </BareButton>
        </ModalBody>
        <ModalFooter>
          <div className="grid grid-cols-6 gap-4 items-center">
            <Button variant="outline" onClick={onClose} className="col-start-7">
              CANCEL
            </Button>
            <Button
              isLoading={isLoading}
              variant="primary"
              onClick={saveReport}
              className="col-start-8">
              SAVE CHANGES
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

const ReportItem = ({
  index,
  description,
  amount,
  type,
  handleUpdate,
}: {
  index: number;
  description: string;
  amount: string;
  type: any;
  handleUpdate: (type, value) => void;
}) => {
  const [itemAmount, setItemAmount] = React.useState(amount);

  const updateAmount = (value) => {
    setItemAmount(value);
    handleUpdate(type, value);
  };
  return (
    <div className="border border-gray-200	border-solid px-3 mt-6">
      <div className="py-3 items-center grid grid-cols-12 gap-4">
        <span className="text-base	font-medium col-span-11">Item {index + 1}</span>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <TextareaField
            className="text-sm"
            disabled={true}
            required
            label="Item details"
            value={description}
            layout="vertical"
          />
        </div>
        <Field>
          <Label>Amount</Label>
          <div>
            <MoneyInput value={itemAmount} onChangeValue={updateAmount} placeholder="0.00" />
          </div>
        </Field>
      </div>
    </div>
  );
};
