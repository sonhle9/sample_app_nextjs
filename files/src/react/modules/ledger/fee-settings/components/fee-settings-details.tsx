import {
  Button,
  Card,
  CardContent,
  DataTableCell as Td,
  DataTableRow as Tr,
  CardHeading,
  DataTable,
  DataTableRowGroup,
  titleCase,
  Fieldset,
  FieldContainer,
  formatMoney,
  Modal,
  ModalHeader,
  TrashIcon,
  formatDate,
  Radio,
  EditIcon,
  Dialog,
  DialogContent,
  DialogFooter,
} from '@setel/portal-ui';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useRouter} from 'src/react/routing/routing.context';
import {FeeTypes} from '../fee-settings.enum';
import {useDeleteProcessorFee, useProcessorFee} from '../fee-settings.queries';
import FeeSettingsForm from './fee-settings-form';

type FeeSettingsDetailsProps = {
  id: string;
};

export const FeeSettingsDetails = (props: FeeSettingsDetailsProps) => {
  const router = useRouter();
  const {id} = props;
  const {data} = useProcessorFee(id);
  const {mutate: remove} = useDeleteProcessorFee(id);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const dismissUpdateForm = () => setShowUpdateForm(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const dismissDeleteDialog = () => setShowDeleteDialog(false);
  const cancelRef = React.useRef(null);

  return (
    <PageContainer
      heading="Payment processor fee details"
      action={
        <Button
          className="mr-4"
          variant="error"
          onClick={() => {
            setShowDeleteDialog(true);
          }}
          leftIcon={<TrashIcon className="w-4 h-4" />}>
          DELETE
        </Button>
      }>
      <Modal
        size="large"
        aria-label="edit payment processor fee"
        isOpen={showUpdateForm}
        onDismiss={dismissUpdateForm}>
        <ModalHeader>Edit details</ModalHeader>
        <FeeSettingsForm
          onCancel={dismissUpdateForm}
          onSuccess={dismissUpdateForm}
          existingData={data}
        />
      </Modal>
      <Dialog
        isOpen={showDeleteDialog}
        onDismiss={dismissDeleteDialog}
        leastDestructiveRef={cancelRef}>
        <DialogContent header="Are you sure to delete this payment processor fee settings?">
          This action cannot be undone and you will not be able to recover any data.
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={dismissDeleteDialog} ref={cancelRef}>
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="error"
            data-testid="delete-button"
            onClick={() => {
              remove(null, {
                onSuccess: () => {
                  router.navigateByUrl('/fee-settings');
                },
              });
            }}>
            DELETE
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="mb-6">
        <CardHeading title={id}>
          <Button
            variant="outline"
            onClick={() => setShowUpdateForm(true)}
            leftIcon={<EditIcon className="w-4 h-4" />}>
            EDIT
          </Button>
        </CardHeading>
        <CardContent>
          <Fieldset legend="GENERAL">
            <FieldContainer
              layout="horizontal-responsive"
              label="Payment processor"
              className="pt-3">
              {titleCase(data?.paymentGatewayVendor) || '-'}
            </FieldContainer>
            <FieldContainer layout="horizontal-responsive" label="Transaction type">
              {titleCase(data?.transactionType, {hasUnderscore: true}) || '-'}
            </FieldContainer>
            <FieldContainer layout="horizontal-responsive" label="Payment option">
              {titleCase(data?.paymentOption || '-', {hasUnderscore: true})}
            </FieldContainer>
            <FieldContainer layout="horizontal-responsive" label="Card scheme">
              {titleCase(data?.cardScheme || '-')}
            </FieldContainer>
          </Fieldset>
          <div className="border-b border border-lightergrey mb-5" />
          <Fieldset legend="FEE SETTINGS">
            <FieldContainer layout="horizontal-responsive" label="Fee method">
              {data && (
                <>
                  <Radio checked={!data.isTiered} value="" readOnly>
                    Fixed
                  </Radio>
                  <Radio checked={data.isTiered} value="" readOnly>
                    Tiered by volume
                  </Radio>
                </>
              )}
            </FieldContainer>
            <FieldContainer layout="horizontal-responsive" label="Fee type">
              <Radio checked={data?.feeType === FeeTypes.FLAT} value="" readOnly>
                Flat
              </Radio>
              <Radio checked={data?.feeType === FeeTypes.PERCENTAGE} value="" readOnly>
                Percentage
              </Radio>
            </FieldContainer>
            {data?.isTiered ? (
              <>
                <FieldContainer layout="horizontal-responsive" label="Tier duration">
                  {titleCase(data?.tiering.duration)}
                </FieldContainer>
                <FieldContainer layout="horizontal-responsive">
                  <DataTable>
                    <DataTableRowGroup groupType="thead">
                      <Tr>
                        <Td>TIER</Td>
                        <Td>FEE ({data?.feeType === FeeTypes.FLAT ? 'RM' : '%'})</Td>
                        <Td>MIN. VOLUME</Td>
                        <Td>MAX. VOLUME</Td>
                      </Tr>
                    </DataTableRowGroup>
                    {data &&
                      data.tiering.tiers.map((tier, i) => (
                        <Tr key={i}>
                          <Td>{i + 1}</Td>
                          <Td>{tier.fee.toFixed(2)}</Td>
                          <Td>{formatMoney(tier.lowerLimit, {currency: 'RM'})}</Td>
                          <Td>{formatMoney(tier.upperLimit, {currency: 'RM'})}</Td>
                        </Tr>
                      ))}
                  </DataTable>
                </FieldContainer>
              </>
            ) : (
              <FieldContainer layout="horizontal-responsive" label="Fee amount">
                {data && data.feeType === FeeTypes.FLAT
                  ? formatMoney(data.fee, {currency: 'RM'})
                  : `${data?.fee}%`}
              </FieldContainer>
            )}
          </Fieldset>
          <div className="border-b border border-lightergrey mb-5" />
          <Fieldset legend="VALIDITY">
            <FieldContainer layout="horizontal-responsive" label="Valid from" className="pt-3">
              {(data &&
                data.validFrom &&
                formatDate(data.validFrom, {formatType: 'dateOnly', format: 'dd MMM yyyy'})) ||
                '-'}
            </FieldContainer>
            <FieldContainer layout="horizontal-responsive" label="Valid to">
              {(data &&
                data.validTo &&
                formatDate(data.validTo, {formatType: 'dateOnly', format: 'dd MMM yyyy'})) ||
                '-'}
            </FieldContainer>
          </Fieldset>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
