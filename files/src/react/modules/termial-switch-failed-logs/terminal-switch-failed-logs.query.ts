import {useQuery} from 'react-query';
import {
  getTerminalSwitchFailedLogs,
  getTerminalSwitchFailedLogsDetail,
} from './terminal-switch-failed-logs.service';

const TERMINAL_SWITCH_FAILED_LOG = 'terminalSwitchFailedLogs';
const TERMINAL_SWITCH_FAILED_LOG_DETAIL = 'terminalSwitchFailedLogsDetail';

export const useTerminalSwitchFailedLogs = (
  filter: Parameters<typeof getTerminalSwitchFailedLogs>[0],
) => {
  return useQuery([TERMINAL_SWITCH_FAILED_LOG, filter], async () =>
    getTerminalSwitchFailedLogs(filter),
  );
};

export const useTerminalSwitchFailedLogsDetail = (
  filter: Parameters<typeof getTerminalSwitchFailedLogsDetail>[0],
) => {
  return useQuery([TERMINAL_SWITCH_FAILED_LOG_DETAIL, filter], async () =>
    getTerminalSwitchFailedLogsDetail(filter),
  );
};
