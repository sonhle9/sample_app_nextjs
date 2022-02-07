import {
  Badge,
  Button,
  Card,
  DescList,
  Dialog,
  EditIcon,
  Modal,
  ModalHeader,
  Skeleton,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {
  useGLParameterDetails,
  useEnableGLParameter,
  useDisableGLParameter,
} from '../general-ledger.queries';
import {GeneralLedgerParameterForm} from './general-ledger-parameter-form';

export interface IGeneralLedgerParameterDetailsProps {
  id: string;
}

export const GeneralLedgerParameterDetails = (props: IGeneralLedgerParameterDetailsProps) => {
  const {data, isLoading} = useGLParameterDetails(props.id);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const dismissEditForm = () => setShowEditForm(false);

  const [showDisableDialog, setShowDisableDialog] = React.useState(false);
  const cancelDisableBtnRef = React.useRef<HTMLButtonElement>(null);
  const dismissDiableDialog = () => setShowDisableDialog(false);
  const {mutate: disable, isLoading: isDisabling} = useDisableGLParameter(props.id);
  const {mutate: enable, isLoading: isEnabling} = useEnableGLParameter(props.id);

  return (
    <PageContainer
      heading={data ? data.transactionType : <Skeleton />}
      action={
        data && (
          <div className="flex items-center space-x-3">
            {data.status === 'active' ? (
              <>
                <Button onClick={() => setShowDisableDialog(true)} variant="error">
                  DISABLE
                </Button>
                <Button
                  onClick={() => setShowEditForm(true)}
                  leftIcon={<EditIcon />}
                  variant="primary"
                  minWidth="none">
                  EDIT
                </Button>
              </>
            ) : (
              <Button onClick={() => enable()} isLoading={isEnabling} variant="primary">
                ENABLE
              </Button>
            )}
          </div>
        )
      }>
      <Modal
        aria-label="Edit general ledger codes"
        isOpen={showEditForm}
        onDismiss={dismissEditForm}>
        <ModalHeader>Edit general ledger codes</ModalHeader>
        {data && (
          <GeneralLedgerParameterForm
            currentGLParameter={data}
            onSuccess={dismissEditForm}
            onCancel={dismissEditForm}
          />
        )}
      </Modal>
      {showDisableDialog && (
        <Dialog
          isOpen={showDisableDialog}
          onDismiss={dismissDiableDialog}
          leastDestructiveRef={cancelDisableBtnRef}
          data-testid="disable-dialog">
          <Dialog.Content header="Are you sure you want to disable this general ledger code?">
            <p>The GL code will be disabled.</p>
          </Dialog.Content>
          <Dialog.Footer>
            <Button onClick={dismissDiableDialog} ref={cancelDisableBtnRef} variant="outline">
              CANCEL
            </Button>
            <Button
              onClick={() =>
                disable(undefined, {
                  onSuccess: dismissDiableDialog,
                })
              }
              variant="error"
              isLoading={isDisabling}>
              DISABLE
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
      <Card className="mb-6">
        <Card.Heading title="General" />
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item
              label="GL profile"
              value={data && titleCase(data.GLProfile, {hasUnderscore: true})}
            />
            <DescList.Item label="Transaction type" value={data && data.transactionType} />
            <DescList.Item
              label="Status"
              value={
                data && (
                  <Badge
                    color={data.status === 'active' ? 'success' : 'grey'}
                    className="uppercase"
                    rounded="rounded">
                    {data.status}
                  </Badge>
                )
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card className="mb-6">
        <Card.Heading title="Debit" />
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item label="GL code" value={data && data.debit.GLCode} />
            <DescList.Item label="GL account no." value={data && data.debit.GLAccountNo} />
            <DescList.Item
              label="GL transaction description"
              value={data && data.debit.GLTransactionDescription}
            />
            <DescList.Item label="GL account name" value={data && data.debit.GLAccountName} />
            <DescList.Item label="Profit center code" value={data && data.debit.profitCenterCode} />
            <DescList.Item label="Cost center code" value={data && data.debit.costCenterCode} />
            <DescList.Item
              label="Extraction indicator"
              value={data && data.debit.extractionIndicator}
            />
            <DescList.Item label="Document Type" value={data && data.debit.documentType} />
          </DescList>
        </Card.Content>
      </Card>
      <Card className="mb-6">
        <Card.Heading title="Credit" />
        <Card.Content>
          <DescList>
            <DescList.Item label="GL code" value={data && data.credit.GLCode} />
            <DescList.Item label="GL account no." value={data && data.credit.GLAccountNo} />
            <DescList.Item
              label="GL transaction description"
              value={data && data.credit.GLTransactionDescription}
            />
            <DescList.Item label="GL account name" value={data && data.credit.GLAccountName} />
            <DescList.Item
              label="Profit center code"
              value={data && data.credit.profitCenterCode}
            />
            <DescList.Item label="Cost center code" value={data && data.credit.costCenterCode} />
            <DescList.Item
              label="Extraction indicator"
              value={data && data.credit.extractionIndicator}
            />
            <DescList.Item label="Document Type" value={data && data.credit.documentType} />
          </DescList>
        </Card.Content>
      </Card>
    </PageContainer>
  );
};
