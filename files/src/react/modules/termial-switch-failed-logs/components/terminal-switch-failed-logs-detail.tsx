import {Alert, JsonPanel} from '@setel/portal-ui';
import React from 'react';
import {useTerminalSwitchFailedLogsDetail} from '../terminal-switch-failed-logs.query';

interface ITerminalSwitchFailedLogProps {
  failedLogId: string;
}

export const TerminalSwitchFailedLogDetail = ({failedLogId}: ITerminalSwitchFailedLogProps) => {
  const {data, isError} = useTerminalSwitchFailedLogsDetail({failedLogId});

  if (isError) {
    return (
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <JsonPanel
          className="text-black"
          defaultOpen
          allowToggleFormat
          json={Object.assign({...data})}
        />
      </div>
    </>
  );
};
