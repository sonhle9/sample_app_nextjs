import {Card, DescItem, DescList, Modal, ModalBody, ModalHeader} from '@setel/portal-ui';
import * as React from 'react';
import {IReceivableException} from 'src/react/services/api-ledger.type';

export function ReceivablesExceptionModal({
  data,
  header,
  onDismiss,
}: {
  data: IReceivableException;
  header: string;
  onDismiss: () => void;
}) {
  const METADATA_FIELDS = Object.entries(data.metadata);
  return (
    <Modal isOpen onDismiss={onDismiss} aria-label={header}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody data-testid="receivable-modal">
        <Card className="mb-8" data-testid="receivable-card">
          <Card.Content className="flex" data-testid="card-content">
            <section className="w-36">
              <strong className="text-xs text-lightgrey">Details</strong>
            </section>
            <section>
              <DescList key="id" data-testid="desc-list">
                <DescItem label="ID" value={data.id} />
              </DescList>
              <DescList key="reason" data-testid="desc-list">
                <DescItem label="Reason" value={data.reason} />
              </DescList>
              <DescList key="isResolved" data-testid="desc-list">
                <DescItem label="Is Resolved" value={String(data.isResolved)} />
              </DescList>
            </section>
          </Card.Content>
          <hr />
          <Card.Content className="flex" data-testid="card-content">
            <section className="w-36">
              <strong className="text-xs text-lightgrey">Meta Data</strong>
            </section>
            <section>
              {METADATA_FIELDS.map((metaData: [string, string | number]) => {
                return (
                  <DescList key={metaData[0]} data-testid="desc-list">
                    <DescItem label={metaData[0]} value={metaData[1]} />
                  </DescList>
                );
              })}
            </section>
          </Card.Content>
        </Card>
      </ModalBody>
    </Modal>
  );
}
