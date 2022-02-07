import React from 'react';
import {DataTable as Table, Modal, formatMoney} from '@setel/portal-ui';
import {RefStatements} from '../billing-statement-summary.types';
type KnockOffModalProps = {
  onClose(): void;
  smartpayAccountId: string;
  refStatements: RefStatements[];
};
export const KnockOffList = ({onClose, refStatements}: KnockOffModalProps) => {
  return (
    <div>
      <Modal header="Knock-off list" isOpen onDismiss={onClose}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="lg:pl-8 md:pl-6">STATEMENT NO.</Table.Th>
              <Table.Th className="text-right">STATEMENT AMOUNT (RM)</Table.Th>
              <Table.Th className="text-right">CYCLE AMOUNT (RM)</Table.Th>
              <Table.Th className="text-right lg:pr-8 md:pr-6">PAID AMOUNT (RM)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {refStatements &&
              refStatements.map((statement) => {
                return (
                  <>
                    <Table.Tr>
                      <Table.Td className="lg:pl-8 md:pl-6">{statement.statementNo}</Table.Td>
                      <Table.Td className="text-right">
                        {formatMoney(Math.abs(statement?.closingBalance) || 0)}
                      </Table.Td>
                      <Table.Td className="text-right">
                        {formatMoney(Math.abs(statement?.currentMonthBalance) || 0)}
                      </Table.Td>
                      <Table.Td className="text-right lg:pr-8 md:pr-6">
                        {formatMoney(Math.abs(statement?.paidAmount) || 0)}
                      </Table.Td>
                    </Table.Tr>
                  </>
                );
              })}
          </Table.Tbody>
        </Table>
      </Modal>
    </div>
  );
};
