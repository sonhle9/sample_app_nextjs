import {
  Button,
  DropdownSelect,
  FieldContainer,
  ModalBody,
  ModalFooter,
  TextField,
  titleCase,
} from '@setel/portal-ui';
import cx from 'classnames';
import * as React from 'react';
import {
  IGeneralLedgerParameter,
  IGeneralLedgerEntryDetails,
} from 'src/react/services/api-ledger.type';
import {GL_PROFILE_OPTIONS} from '../general-ledger.constant';
import {useCreateGLParameter, useUpdateGLParameter} from '../general-ledger.queries';

export interface IGeneralLedgerParameterFormProps {
  currentGLParameter?: IGeneralLedgerParameter;
  onSuccess: (result: IGeneralLedgerParameter) => void;
  onCancel: () => void;
}

export const GeneralLedgerParameterForm = ({
  currentGLParameter,
  onSuccess,
  onCancel,
}: IGeneralLedgerParameterFormProps) => {
  const {mutate: create, isLoading: isCreating} = useCreateGLParameter();
  const {mutate: update, isLoading: isUpdating} = useUpdateGLParameter(
    currentGLParameter ? currentGLParameter.id : '',
  );
  const [GLProfile, setGLProfile] = React.useState(
    currentGLParameter ? currentGLParameter.GLProfile : '',
  );
  const [transactionType, setTransactionType] = React.useState(
    currentGLParameter ? currentGLParameter.transactionType : '',
  );

  const [debitGLCode, setDebitGLCode] = React.useState(
    currentGLParameter ? currentGLParameter.debit.GLCode : '',
  );
  const [debitGLAccountNo, setDebitGLAccountNo] = React.useState(
    currentGLParameter ? currentGLParameter.debit.GLAccountNo : '',
  );
  const [debitGLAccountName, setDebitGLAccountName] = React.useState(
    currentGLParameter ? currentGLParameter.debit.GLAccountName : '',
  );
  const [debitGLTransactionDescription, setDebitGLTransactionDescription] = React.useState(
    currentGLParameter ? currentGLParameter.debit.GLTransactionDescription : '',
  );
  const [debitProfitCenterCode, setDebitProfitCenterCode] = React.useState(
    currentGLParameter ? currentGLParameter.debit.profitCenterCode : '',
  );
  const [debitCostCenterCode, setDebitCostCenterCode] = React.useState(
    currentGLParameter ? currentGLParameter.debit.costCenterCode : '',
  );
  const [debitExtractionIndicator, setDebitExtractionIndicator] = React.useState(
    currentGLParameter ? currentGLParameter.debit.extractionIndicator : 'detailed',
  );

  const [creditGLCode, setCreditGLCode] = React.useState(
    currentGLParameter ? currentGLParameter.credit.GLCode : '',
  );
  const [creditGLAccountNo, setCreditGLAccountNo] = React.useState(
    currentGLParameter ? currentGLParameter.credit.GLAccountNo : '',
  );
  const [creditGLAccountName, setCreditGLAccountName] = React.useState(
    currentGLParameter ? currentGLParameter.credit.GLAccountName : '',
  );
  const [creditGLTransactionDescription, setCreditGLTransactionDescription] = React.useState(
    currentGLParameter ? currentGLParameter.credit.GLTransactionDescription : '',
  );
  const [creditProfitCenterCode, setCreditProfitCenterCode] = React.useState(
    currentGLParameter ? currentGLParameter.credit.profitCenterCode : '',
  );
  const [creditCostCenterCode, setCreditCostCenterCode] = React.useState(
    currentGLParameter ? currentGLParameter.credit.costCenterCode : '',
  );
  const [creditExtractionIndicator, setCreditExtractionIndicator] = React.useState(
    currentGLParameter ? currentGLParameter.credit.extractionIndicator : 'detailed',
  );
  const [creditDocumentType, setCreditDocumentType] = React.useState(
    currentGLParameter ? currentGLParameter.credit.documentType : 'DA',
  );
  const [debitDocumentType, setDebitDocumentType] = React.useState(
    currentGLParameter ? currentGLParameter.debit.documentType : 'DA',
  );

  const isLoading = isCreating || isUpdating;

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const operation = currentGLParameter ? update : create;
        operation(
          {
            GLProfile,
            transactionType,
            debit: {
              GLCode: debitGLCode,
              GLAccountNo: debitGLAccountNo,
              GLAccountName: debitGLAccountName,
              GLTransactionDescription: debitGLTransactionDescription,
              profitCenterCode: debitProfitCenterCode,
              costCenterCode: debitCostCenterCode,
              extractionIndicator: debitExtractionIndicator as 'detailed' | 'summary',
              documentType: debitDocumentType,
            },
            credit: {
              GLCode: creditGLCode,
              GLAccountNo: creditGLAccountNo,
              GLAccountName: creditGLAccountName,
              GLTransactionDescription: creditGLTransactionDescription,
              profitCenterCode: creditProfitCenterCode,
              costCenterCode: creditCostCenterCode,
              extractionIndicator: creditExtractionIndicator as 'detailed' | 'summary',
              documentType: creditDocumentType,
            },
          },
          {
            onSuccess: onSuccess,
          },
        );
      }}>
      <ModalBody>
        <Fieldset label="GENERAL">
          <FieldContainer label="GL profile" layout="horizontal-responsive">
            <DropdownSelect<string>
              value={GLProfile}
              onChangeValue={setGLProfile}
              options={glProfileOptions}
              data-testid="GL-profile"
              className="sm:w-60"
            />
          </FieldContainer>
          <TextField
            label="Transaction type"
            value={transactionType}
            onChangeValue={setTransactionType}
            required
            layout="horizontal-responsive"
          />
        </Fieldset>
        <Fieldset label="DEBIT" borderTop data-testid="debit-fields">
          <TextField
            label="GL code"
            value={debitGLCode}
            onChangeValue={setDebitGLCode}
            layout="horizontal-responsive"
            className="sm:w-60"
            required
          />
          <TextField
            label="GL account no"
            value={debitGLAccountNo}
            onChangeValue={setDebitGLAccountNo}
            layout="horizontal-responsive"
            required
          />
          <TextField
            label="GL account name"
            value={debitGLAccountName}
            onChangeValue={setDebitGLAccountName}
            layout="horizontal-responsive"
          />
          <TextField
            label="GL transaction description"
            value={debitGLTransactionDescription}
            onChangeValue={setDebitGLTransactionDescription}
            layout="horizontal-responsive"
          />
          <TextField
            label="Profit centre code"
            value={debitProfitCenterCode}
            onChangeValue={setDebitProfitCenterCode}
            layout="horizontal-responsive"
            className="sm:w-60"
            required
          />
          <TextField
            label="Cost centre code"
            value={debitCostCenterCode}
            onChangeValue={setDebitCostCenterCode}
            layout="horizontal-responsive"
            className="sm:w-60"
          />
          <FieldContainer label="Extraction indicator" layout="horizontal-responsive">
            <DropdownSelect<IGeneralLedgerEntryDetails['extractionIndicator']>
              value={debitExtractionIndicator}
              onChangeValue={setDebitExtractionIndicator}
              options={extractionOptions as any}
              data-testid="debit-extraction"
              className="sm:w-60"
            />
          </FieldContainer>
          <FieldContainer label="Document type" layout="horizontal-responsive">
            <DropdownSelect<IGeneralLedgerEntryDetails['documentType']>
              value={debitDocumentType}
              onChangeValue={setDebitDocumentType}
              options={documentTypeOptions as any}
              data-testid="debit-document-type"
              className="sm:w-60"
            />
          </FieldContainer>
        </Fieldset>
        <Fieldset label="CREDIT" borderTop data-testid="credit-fields">
          <TextField
            label="GL code"
            value={creditGLCode}
            onChangeValue={setCreditGLCode}
            layout="horizontal-responsive"
            required
          />
          <TextField
            label="GL account no"
            value={creditGLAccountNo}
            onChangeValue={setCreditGLAccountNo}
            layout="horizontal-responsive"
            required
          />
          <TextField
            label="GL account name"
            value={creditGLAccountName}
            onChangeValue={setCreditGLAccountName}
            layout="horizontal-responsive"
          />
          <TextField
            label="GL transaction description"
            value={creditGLTransactionDescription}
            onChangeValue={setCreditGLTransactionDescription}
            layout="horizontal-responsive"
          />
          <TextField
            label="Profit centre code"
            value={creditProfitCenterCode}
            onChangeValue={setCreditProfitCenterCode}
            layout="horizontal-responsive"
            className="sm:w-60"
            required
          />
          <TextField
            label="Cost centre code"
            value={creditCostCenterCode}
            onChangeValue={setCreditCostCenterCode}
            layout="horizontal-responsive"
            className="sm:w-60"
          />
          <FieldContainer label="Extraction indicator" layout="horizontal-responsive">
            <DropdownSelect<IGeneralLedgerEntryDetails['extractionIndicator']>
              value={creditExtractionIndicator}
              onChangeValue={setCreditExtractionIndicator}
              options={extractionOptions as any}
              data-testid="credit-extraction"
              className="sm:w-60"
            />
          </FieldContainer>
          <FieldContainer label="Document type" layout="horizontal-responsive">
            <DropdownSelect<IGeneralLedgerEntryDetails['documentType']>
              value={creditDocumentType}
              onChangeValue={setCreditDocumentType}
              options={documentTypeOptions as any}
              data-testid="debit-document-type"
              className="sm:w-60"
            />
          </FieldContainer>
        </Fieldset>
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

const Fieldset = ({
  label,
  children,
  borderTop,
  ...fieldsetProps
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  borderTop?: boolean;
} & React.ComponentPropsWithoutRef<'fieldset'>) => {
  return (
    <fieldset {...fieldsetProps}>
      <div
        className={cx(
          'lg:grid lg:grid-cols-5 lg:gap-x-2',
          borderTop && 'border-t border-gray-200 lg:pt-5',
        )}>
        <div className="py-3">
          <legend className="text-lightgrey text-xs font-semibold">{label}</legend>
        </div>
        <div className="lg:col-span-4">{children}</div>
      </div>
    </fieldset>
  );
};

const glProfileOptions = GL_PROFILE_OPTIONS.map((p) => ({
  value: p,
  label: titleCase(p, {hasUnderscore: true}),
}));

const extractionOptions = [
  {
    label: 'Detailed',
    value: 'detailed',
  },
  {
    label: 'Summary',
    value: 'summary',
  },
];

const documentTypeOptions = [
  {
    label: 'DA',
    value: 'DA',
  },
  {
    label: 'KZ',
    value: 'KZ',
  },
  {
    label: 'RE',
    value: 'RE',
  },
  {
    label: 'DR',
    value: 'DR',
  },
  {
    label: 'KR',
    value: 'KR',
  },
  {
    label: 'DN',
    value: 'DN',
  },
];
