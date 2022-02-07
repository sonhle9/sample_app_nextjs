import {Card, Skeleton, Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {EntryModes, ITerminalMenu} from 'src/react/services/api-terminal.type';
import TerminalAppMenu from './terminal-app-menu';
import TerminalEntryMode from './terminal-entry-mode';
import TerminalMyDebitOptIn from './terminal-mydebit-optin';
import TerminalPaymentAcceptance from './terminal-payment-acceptance';

interface TerminalConfigurationParameterProps {
  serialNum: string;
  allowedEntryModes: EntryModes[];
  myDebitOptIn: boolean;
  terminalMenu: ITerminalMenu;
  merchantId: string;
  isLoading: boolean;
}
const TerminalConfigParameter = ({
  serialNum,
  allowedEntryModes,
  myDebitOptIn,
  terminalMenu,
  merchantId,
  isLoading,
}: TerminalConfigurationParameterProps) => {
  return (
    <Card className="mb-8" isLoading={isLoading}>
      <Card.Heading title="Terminal configuration parameter" />
      {isLoading ? (
        <Card.Content>
          <div className="flex space-x-4 mb-2">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          <Skeleton width="full" height="medium" className="mb-2" />
          <Skeleton width="wide" height="medium" className="mb-2" />
        </Card.Content>
      ) : (
        <Tabs
          items={[
            {
              label: 'Payment Acceptance',
              content: <TerminalPaymentAcceptance merchantId={merchantId} />,
            },
            {
              label: 'Entry Mode',
              content: (
                <TerminalEntryMode serialNum={serialNum} allowedEntryModes={allowedEntryModes} />
              ),
            },
            {
              label: 'MyDebit',
              content: <TerminalMyDebitOptIn serialNum={serialNum} myDebitOptIn={myDebitOptIn} />,
            },
            {
              label: 'Terminal App Menu',
              content: <TerminalAppMenu serialNum={serialNum} terminalMenu={terminalMenu} />,
            },
          ]}
        />
      )}
    </Card>
  );
};

export default TerminalConfigParameter;
