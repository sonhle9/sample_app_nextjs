import {Alert, DataTable as Table, Text} from '@setel/portal-ui';
import * as React from 'react';
import {useGetPaymentAcceptance} from '../../setel-terminals.queries';
import {SetelTerminalCardType} from '../../setel-terminals.types';

interface TerminalPaymentAcceptanceProps {
  merchantId: string;
}

const TerminalPaymentAcceptance = ({merchantId}: TerminalPaymentAcceptanceProps) => {
  const {data, isLoading, isError} = useGetPaymentAcceptance(merchantId);
  if (isError) {
    return (
      <div className="px-6">
        <Alert
          className="my-4"
          variant="error"
          description="Payment acceptance server error! Please try again."
          accentBorder
        />
      </div>
    );
  }

  return (
    <>
      <Table isLoading={isLoading}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>PAYMENT TYPE</Table.Th>
            <Table.Th className="text-right">PAYMENT ACCEPTANCE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data &&
            Object.keys(data).map((key: SetelTerminalCardType, index) => (
              <Table.Tr key={index}>
                <Table.Td>{data[key].label}</Table.Td>
                <Table.Td className="text-right">
                  {data[key]?.brands?.length > 0
                    ? data[key].brands.map((card, index) => {
                        const isMoreThanOneChild = data[key]?.brands?.length > 1;
                        return (
                          <Text key={index} className={isMoreThanOneChild ? 'pb-6 last:pb-0' : ''}>
                            {card}
                          </Text>
                        );
                      })
                    : '-'}
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default TerminalPaymentAcceptance;
