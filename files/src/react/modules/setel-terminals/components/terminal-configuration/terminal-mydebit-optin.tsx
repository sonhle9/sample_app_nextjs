import {BareButton, Card, DataTable as Table, Toggle} from '@setel/portal-ui';
import * as React from 'react';
import {useUpdateTerminal} from '../../setel-terminals.queries';

interface TerminalMyDebitOptInProps {
  myDebitOptIn: boolean;
  serialNum: string;
}

const TerminalMyDebitOptIn = ({
  myDebitOptIn: initialMyDebitOptIn,
  serialNum,
}: TerminalMyDebitOptInProps) => {
  const [myDebitOptIn, setMyDebitOptIn] = React.useState(initialMyDebitOptIn);
  const {mutate} = useUpdateTerminal();

  const handleUpdate = (isEnabled: boolean) => {
    setMyDebitOptIn(isEnabled);
    mutate({serialNum, request: {myDebitOptIn: isEnabled}});
  };

  React.useEffect(() => {
    setMyDebitOptIn(initialMyDebitOptIn);
  }, [initialMyDebitOptIn]);

  return (
    <>
      <div className="w-full flex">
        <Card.Content className="flex ml-auto">
          <BareButton onClick={() => handleUpdate(true)} className="text-brand-500">
            ENABLE ALL
          </BareButton>
          <span className="px-3 font-bold text-grey-200">|</span>
          <BareButton onClick={() => handleUpdate(false)} className="text-brand-500">
            DISABLE ALL
          </BareButton>
        </Card.Content>
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="">MYDEBIT</Table.Th>
            <Table.Th className="text-right">ENABLE/DISABLE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Opt In</Table.Td>
            <Table.Td className="text-right">
              <Toggle on={myDebitOptIn} onChangeValue={handleUpdate} />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </>
  );
};

export default TerminalMyDebitOptIn;
