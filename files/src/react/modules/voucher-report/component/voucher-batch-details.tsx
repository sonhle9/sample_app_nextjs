import {Button, formatDate, JsonPanel} from '@setel/portal-ui';
import React, {useState} from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {downloadFile} from 'src/react/lib/utils';
import {VoucherBatchEditModal} from '../../gift/component/vouchers-batches/voucher-batch-edit-modal';
import {VoucherBatchSection} from '../../gift/shared/gift-voucher.constant';
import {ModeType, VoucherBatchGenerationType} from '../shared/voucher.constants';
import {useVoucherBatchDetails} from '../voucher.query';
import {getVoucherBatches} from '../voucher.service';
import {VoucherBatchVoidModal} from './voucher-batch-void-modal';

interface IVoucherDetailsProps {
  id: string;
}

export const VoucherBatchDetails = (props: IVoucherDetailsProps) => {
  const [visibleVoidVoucherModal, setVisibleVoidVoucherModal] = useState(false);
  const [visibleEditVoucherModal, setVisibleEditVoucherModal] = useState(false);
  const [visibleCloneVoucherModal, setVisibleCloneVoucherModal] = useState(false);
  const [sectionEdit] = useState(VoucherBatchSection.general);
  const {data} = useVoucherBatchDetails(props.id);

  const downloadVouchersBatch = async (voucherName: string, batchId: string) => {
    const csvData = await getVoucherBatches(batchId);
    downloadFile(
      csvData,
      `${voucherName}${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
    );
  };

  return (
    <PageContainer heading={`Voucher batch details`}>
      <div className="flex justify-end mb-4">
        <Button className="mr-4" variant="primary" onClick={() => setVisibleEditVoucherModal(true)}>
          Edit
        </Button>
        <Button
          className="mr-4"
          variant="primary"
          onClick={() => setVisibleCloneVoucherModal(true)}>
          Clone
        </Button>
        <Button className="mr-4" variant="primary" onClick={() => setVisibleVoidVoucherModal(true)}>
          Void Voucher
        </Button>
        {data?.generationType !== VoucherBatchGenerationType.ON_DEMAND && (
          <Button
            className="mr-4"
            variant="primary"
            onClick={() => downloadVouchersBatch(data?.name, data?.id)}>
            Download
          </Button>
        )}
      </div>
      {visibleVoidVoucherModal && (
        <VoucherBatchVoidModal close={() => setVisibleVoidVoucherModal(false)} />
      )}
      {visibleEditVoucherModal && (
        <VoucherBatchEditModal
          section={sectionEdit}
          modeType={ModeType.Edit}
          onClose={() => setVisibleEditVoucherModal(false)}
        />
      )}
      {visibleCloneVoucherModal && (
        <VoucherBatchEditModal
          section={sectionEdit}
          modeType={ModeType.Clone}
          onClose={() => setVisibleCloneVoucherModal(false)}
        />
      )}
      <JsonPanel defaultOpen allowToggleFormat json={data as any} />
    </PageContainer>
  );
};
