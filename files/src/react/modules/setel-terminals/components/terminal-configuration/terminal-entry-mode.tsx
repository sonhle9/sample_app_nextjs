import {BareButton, Card, DataTable as Table, Toggle} from '@setel/portal-ui';
import * as React from 'react';
import {EntryModes} from 'src/react/services/api-terminal.type';
import _ from 'lodash';
import {useUpdateTerminal} from '../../setel-terminals.queries';

const ENTRY_MODES = [
  {label: 'Tap', value: EntryModes.CONTACTLESS},
  {label: 'Swipe', value: EntryModes.SWIPE},
  {label: 'Insert', value: EntryModes.CHIP},
];

interface TerminalEntryModeProps {
  allowedEntryModes: EntryModes[];
  serialNum: string;
}

const TerminalEntryMode = ({allowedEntryModes, serialNum}: TerminalEntryModeProps) => {
  const [entryModes, setEntryModes] = React.useState(allowedEntryModes);
  const {mutate} = useUpdateTerminal();
  const isEntryModeEnabled = (value: EntryModes) => entryModes.includes(value);

  const handleUpdateEntryMode = (value: EntryModes, isEnabled: boolean) => {
    let updatedEntryModes: EntryModes[];
    if (isEnabled) {
      setEntryModes((prev) => {
        updatedEntryModes = [...prev, value];
        return updatedEntryModes;
      });
    } else {
      setEntryModes((prev) => {
        updatedEntryModes = _.without(prev, value);
        return updatedEntryModes;
      });
    }

    mutate({serialNum, request: {allowedEntryModes: updatedEntryModes}});
  };

  const handleUpdateAll = (isEnabled: boolean) => {
    let updatedEntryModes = ENTRY_MODES.map(({value}) => value);

    if (isEnabled) {
      setEntryModes(updatedEntryModes);
    } else {
      updatedEntryModes = [];
      setEntryModes([]);
    }

    mutate({serialNum, request: {allowedEntryModes: updatedEntryModes}});
  };

  React.useEffect(() => {
    setEntryModes(allowedEntryModes);
  }, [allowedEntryModes]);

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
            <Table.Th className="">ENTRY MODE</Table.Th>
            <Table.Th className="text-right">ENABLE/DISABLE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ENTRY_MODES.map(({label, value}, index) => (
            <Table.Tr key={index}>
              <Table.Td>{label}</Table.Td>
              <Table.Td className="text-right">
                <Toggle
                  on={isEntryModeEnabled(value)}
                  onChangeValue={(isEnabled) => handleUpdateEntryMode(value, isEnabled)}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default TerminalEntryMode;
