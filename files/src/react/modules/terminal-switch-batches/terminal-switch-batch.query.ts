import {useMutation, useQuery} from 'react-query';
import {
  getTerminalSwitchBatchDetail,
  getTerminalSwitchBatches,
  sentForceCloseRequest,
} from './terminal-switch-batches.service';

export const TERMINAL_SWITCH_BATCH = 'terminal_switch_batch';
export const TERMINAL_SWITCH_BATCH_DETAIL = 'terminal_switch_batch_detail';

export const useTerminalSwitchBatches = (
  filter: Parameters<typeof getTerminalSwitchBatches>[0],
) => {
  return useQuery([TERMINAL_SWITCH_BATCH, filter], () => getTerminalSwitchBatches(filter));
};

export const useTerminalSwitchBatchDetail = (
  filter: Parameters<typeof getTerminalSwitchBatchDetail>[0],
) => {
  return useQuery([TERMINAL_SWITCH_BATCH_DETAIL, filter], async () => {
    return getTerminalSwitchBatchDetail(filter);
  });
};

export const useForceCloseRequest = () => {
  return useMutation(sentForceCloseRequest);
};
