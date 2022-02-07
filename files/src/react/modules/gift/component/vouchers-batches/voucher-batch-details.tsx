import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeading,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescList,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  EditIcon,
  formatDate,
  JsonPanel,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {VoucherBatchEditModal} from './voucher-batch-edit-modal';
import {DisplayAs, ModeType, VoucherBatchSection} from '../../shared/gift-voucher.constant';
import {
  useCloneVoucher,
  useEditVoucher,
  useVoidVouchers,
  useVoucherBatchDetails,
} from '../../voucher-batch.query';
import {VoucherBatchVoidModal} from './voucher-batch-void-modal';
import {useDownloadVoucherBatch} from '../../shared/use-download-voucher-batch';
import {useParams} from 'src/react/routing/routing.context';
import {useFormik} from 'formik';
import moment from 'moment';

// interface IVoucherDetailsProps {
//   id: string;
// }

export const VoucherBatchDetails = () => {
  const {id} = useParams();
  const [visibleVoidVoucherModal, setVisibleVoidVoucherModal] = useState(false);
  const [visibleEditVoucherModal, setVisibleEditVoucherModal] = useState(false);
  const [visibleEditRulesModal, setVisibleEditRulesModal] = useState(false);
  const [sectionEdit, setSectionEdit] = useState(VoucherBatchSection.general);
  const {data: voucherBatch, isLoading} = useVoucherBatchDetails(id);
  const downloadVoucherBatch = useDownloadVoucherBatch();
  const {
    mutate: voidVouchers,
    isSuccess: voidVoucherSuccess,
    data: voidVoucherResponse,
  } = useVoidVouchers();
  const {mutate: editVoucher} = useEditVoucher();
  const {mutate: cloneVoucher} = useCloneVoucher();

  const formik = useFormik({
    initialValues: {
      batchId: voucherBatch?.id || '',
      name: voucherBatch?.name || '',
      file: undefined,
      redeemType: voucherBatch?.redeemType || '',
      expiryDate: voucherBatch?.expiryDate || undefined,
      startDate: voucherBatch?.startDate || undefined,
      // redeemExpiry: {date: undefined, days: ''},
      duration: voucherBatch?.expiryDate
        ? moment(voucherBatch?.expiryDate).diff(voucherBatch?.startDate, 'days')
        : 0,
      generationType: voucherBatch?.generationType || '',
      termsUrl: voucherBatch?.termsUrl || '',
      bannerUrl: voucherBatch?.bannerUrl || '',
      iconUrl: voucherBatch?.iconUrl || '',
      description: voucherBatch?.description || '',
      termContent: voucherBatch?.termContent || '',
      displayAs: voucherBatch?.displayAs || '',
      rules: voucherBatch?.rules || [],
      vouchersCount: voucherBatch?.vouchersCount,
      postfix: voucherBatch?.postfix || '',
      prefix: voucherBatch?.prefix || '',
    },
    enableReinitialize: true,
    onSubmit: () => handleVoucherBatchActions(ModeType.Edit),
  });

  const {values: formValues, setValues, handleSubmit} = formik;

  const handleVoucherBatchActions = (mode) => {
    switch (mode) {
      case ModeType.Edit:
        editVoucher(formValues);
        break;
      case ModeType.Clone:
        const cloneVoucherBatch = {
          ...formValues,
          rules: voucherBatch.rules.map((rule) => ({
            name: rule.name,
            amount: rule.amount,
            expiryDate: rule.expiryDate || undefined,
            daysToExpire: rule.daysToExpire,
            tag: rule.tag,
            type: rule.type,
          })),
        };
        cloneVoucher(cloneVoucherBatch);
        break;
    }
  };

  return (
    <PageContainer
      heading={voucherBatch?.name}
      action={
        <div>
          <DropdownMenu label="ACTIONS" variant="outline">
            <DropdownMenuItems>
              <DropdownItem
                children="Clone voucher"
                onSelect={() => handleVoucherBatchActions(ModeType.Clone)}
              />
              <DropdownItem
                children="Void voucher"
                onSelect={() => setVisibleVoidVoucherModal(true)}
              />
              <DropdownItem
                children="Download CSV"
                onSelect={() => downloadVoucherBatch(voucherBatch?.name, voucherBatch?.id)}
              />
            </DropdownMenuItems>
          </DropdownMenu>
          <Button
            className="ml-3"
            variant="primary"
            minWidth="none"
            children="SAVE"
            onClick={() => handleSubmit()}
          />
        </div>
      }>
      {voidVoucherSuccess && (
        <Alert
          className="mb-8"
          variant="success"
          description={`${
            voidVoucherResponse.filter((code) => code.status === 'Voided').length
          } voucher batch successfully deleted.`}
        />
      )}
      {visibleVoidVoucherModal && (
        <VoucherBatchVoidModal
          voidVouchers={voidVouchers}
          close={() => setVisibleVoidVoucherModal(false)}
        />
      )}
      {visibleEditVoucherModal && (
        <VoucherBatchEditModal
          section={sectionEdit}
          modeType={ModeType.Edit}
          onClose={() => setVisibleEditVoucherModal(false)}
          onSave={setValues}
          voucherBatch={formValues}
        />
      )}

      {visibleEditRulesModal && (
        <VoucherBatchEditModal
          section={sectionEdit}
          modeType={ModeType.EditRules}
          onClose={() => setVisibleEditRulesModal(false)}
          onSave={setValues}
          voucherBatch={formValues}
        />
      )}

      <Card className="mb-10" expandable defaultIsOpen>
        <CardHeading title="General">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={() => {
              setSectionEdit(VoucherBatchSection.general);
              setVisibleEditVoucherModal(true);
            }}>
            EDIT
          </Button>
        </CardHeading>
        <CardContent>
          <DescList isLoading={isLoading} className={'pt-3'}>
            <DescList.Item label="Voucher name" value={formValues?.name} />
            <DescList.Item label="Redeem type" value={formValues?.redeemType} />
            <DescList.Item label="Generation type" value={formValues?.generationType} />
            <DescList.Item label="Voucher quantity" value={formValues?.vouchersCount || '-'} />
            <DescList.Item
              label="Start date"
              value={formValues?.startDate ? formatDate(new Date(formValues.startDate)) : '-'}
            />
            <DescList.Item
              label="Expiry date"
              value={formValues?.expiryDate ? formatDate(new Date(formValues.expiryDate)) : '-'}
            />
          </DescList>
        </CardContent>
      </Card>
      <Card className="mb-10" expandable defaultIsOpen>
        <CardHeading title="Voucher details">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            data-testid="edit-details"
            onClick={() => {
              setSectionEdit(VoucherBatchSection.details);
              setVisibleEditVoucherModal(true);
            }}>
            EDIT
          </Button>
        </CardHeading>
        <CardContent>
          <DescList isLoading={isLoading} className={'pt-3'}>
            <DescList.Item label="Voucher code prefix" value={formValues?.prefix || '-'} />
            <DescList.Item label="Voucher code postfix" value={formValues?.postfix || '-'} />
            <DescList.Item label="Banner image URL" value={formValues?.bannerUrl || '-'} />
            <DescList.Item label="Icon image URL" value={formValues?.iconUrl || '-'} />
            <DescList.Item label="Description" value={formValues?.description || '-'} />
            <DescList.Item label="Terms & condition URL" value={formValues?.termsUrl || '-'} />
            <DescList.Item
              label="Terms & condition Content"
              value={formValues?.termContent || '-'}
            />
            <DescList.Item label="Display as" value={DisplayAs[formValues?.displayAs] || '-'} />
            <DescList.Item label="Issued" value={voucherBatch?.breakDown?.issued || '-'} />
            <DescList.Item label="Granted" value={voucherBatch?.breakDown?.granted || '-'} />
            <DescList.Item label="Redeemed" value={voucherBatch?.breakDown?.redeemed || '-'} />
            <DescList.Item label="Expired" value={voucherBatch?.breakDown?.expired || '-'} />
            <DescList.Item label="Voided" value={voucherBatch?.breakDown?.voided || '-'} />
          </DescList>
        </CardContent>
      </Card>
      <Card className="mb-10" expandable defaultIsOpen>
        <CardHeading title="Batch rules">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={() => {
              setSectionEdit(VoucherBatchSection.rules);
              setVisibleEditRulesModal(true);
            }}>
            EDIT
          </Button>
        </CardHeading>
        <CardContent>
          <DataTable isLoading={isLoading}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Rule Name</Td>
                <Td>Amount (RM)</Td>
                <Td>Expiry</Td>
                <Td>Type</Td>
                <Td>Tag</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {formValues &&
                formValues.rules &&
                formValues.rules.map((rule, index) => (
                  <Tr key={index}>
                    <Td>{rule.name}</Td>
                    <Td>{rule.amount}</Td>
                    {rule.daysToExpire ? (
                      <Td>{rule.daysToExpire} days</Td>
                    ) : (
                      <Td>{rule.expiryDate && formatDate(rule.expiryDate)}</Td>
                    )}
                    <Td>{rule.type}</Td>
                    <Td>{rule.tag}</Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            {formValues && formValues.rules && !formValues.rules.length && (
              <DataTableCaption>
                <div className="py-5">
                  <div className="text-center py-5 text-md">
                    <p className="font-normal">You have not added any batch rules yet</p>
                  </div>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </CardContent>
      </Card>
      <JsonPanel defaultOpen allowToggleFormat json={formValues as any} />
    </PageContainer>
  );
};
