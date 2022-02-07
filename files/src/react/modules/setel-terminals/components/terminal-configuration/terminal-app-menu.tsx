import {BareButton, Card, DataTable as Table, Toggle} from '@setel/portal-ui';
import * as React from 'react';
import {ITerminalMenu} from 'src/react/services/api-terminal.type';
import {useUpdateTerminal} from '../../setel-terminals.queries';

interface TerminalAppMenuProps {
  terminalMenu: ITerminalMenu;
  serialNum: string;
}

const TerminalMenuLabel: Record<terminalMenuKeys, string> = {
  isChargeEnabled: 'Charge',
  isSmartpaySaleEnabled: 'Smartpay sale',
  isTransactionEnabled: 'Transaction',
  isTopUpEnabled: 'Top-up',
  isCheckBalanceEnabled: 'Check balance',
  isSettlementEnabled: 'Run settlement',
  isSettingsEnabled: 'Settings',
  isTmsFunctionsEnabled: 'TMS activity',
};

type terminalMenuKeys = keyof ITerminalMenu;

const TerminalAppMenu = ({terminalMenu: initialTerminalMenu, serialNum}: TerminalAppMenuProps) => {
  const [terminalMenu, setTerminalMenu] = React.useState(initialTerminalMenu);
  const {mutate} = useUpdateTerminal();

  const handleUpdate = (value: terminalMenuKeys, isEnabled: boolean) => {
    let updatedTerminalMenu: ITerminalMenu;
    setTerminalMenu((prev) => {
      updatedTerminalMenu = {...prev, [value]: isEnabled};
      return updatedTerminalMenu;
    });

    mutate({serialNum, request: {terminalMenu: updatedTerminalMenu}});
  };

  const handleUpdateAll = (isEnabled: boolean) => {
    const updatedTerminalMenu = Object.keys(terminalMenu).reduce((acc, key) => {
      return {...acc, [key]: isEnabled};
    }, terminalMenu);

    setTerminalMenu(updatedTerminalMenu);

    mutate({serialNum, request: {terminalMenu: updatedTerminalMenu}});
  };

  React.useEffect(() => {
    setTerminalMenu(initialTerminalMenu);
  }, [initialTerminalMenu]);

  return (
    <>
      <div className="w-full flex">
        <Card.Content className="flex ml-auto">
          <BareButton onClick={() => handleUpdateAll(true)} className="text-brand-500">
            ENABLE ALL
          </BareButton>
          <span className="px-3 font-bold text-grey-200">|</span>
          <BareButton onClick={() => handleUpdateAll(false)} className="text-brand-500">
            DISABLE ALL
          </BareButton>
        </Card.Content>
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="">MENU</Table.Th>
            <Table.Th className="text-right">ENABLE/DISABLE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.keys(terminalMenu)
            .reverse()
            .map((key: terminalMenuKeys) => (
              <Table.Tr key={key}>
                <Table.Td>{TerminalMenuLabel[key]}</Table.Td>
                <Table.Td className="text-right">
                  <Toggle
                    on={terminalMenu[key]}
                    onChangeValue={(isEnabled) => handleUpdate(key, isEnabled)}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default TerminalAppMenu;
