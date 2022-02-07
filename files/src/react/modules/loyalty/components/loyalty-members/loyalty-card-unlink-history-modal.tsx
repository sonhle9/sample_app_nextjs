import * as React from 'react';
import {
  Modal,
  ModalHeader,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  formatDate,
} from '@setel/portal-ui';
import {Member} from '../../loyalty-members.type';
import {useGetUnlinkHistory} from '../../loyalty-members.queries';
import {maskMesra} from 'src/shared/helpers/mask-helpers';

export type LoyaltyCardUnlinkHistoryModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
};

export const LoyaltyCardUnlinkHistoryModal: React.VFC<LoyaltyCardUnlinkHistoryModalProps> = ({
  isOpen,
  onDismiss,
  member,
}) => {
  const {data: unlinkHistory} = useGetUnlinkHistory({userId: member?.userId}, {enabled: isOpen});

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-label="unlink-card-history"
      data-testid="unlink-card-history-modal">
      <ModalHeader>Unlinked card history</ModalHeader>
      <Table>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>No</Td>
            <Td>Card number</Td>
            <Td>Card type</Td>
            <Td className="text-right">Updated on</Td>
          </Tr>
        </DataTableRowGroup>
        {unlinkHistory?.data?.length ? (
          <DataTableRowGroup>
            {unlinkHistory.data.map((history, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{maskMesra(history.cardNumber)}</Td>
                <Td>{history.cardType || '-'}</Td>
                <Td className="text-right">
                  {history.createdAt ? formatDate(history.createdAt) : '-'}
                </Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        ) : (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-history">
            <p>No unlink history for this member</p>
          </DataTableCaption>
        )}
      </Table>
    </Modal>
  );
};
