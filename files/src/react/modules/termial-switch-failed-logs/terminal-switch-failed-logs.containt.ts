import {FailedLogType, TerminalSwitchTransactionSource} from './terminal-switch-failed-logs.type';

interface ChooseInterface {
  label: string;
  value: string;
}

export const TerminalSwitchTransactionSource2Text: Record<TerminalSwitchTransactionSource, string> =
  {
    [TerminalSwitchTransactionSource.SETEL]: 'Setel',
    [TerminalSwitchTransactionSource.INVENCO]: 'Invenco',
  };

export const TerminalSwitchFailedLogType2Text: Record<FailedLogType, string> = {
  [FailedLogType.InvalidMac]: 'Invalid Mac',
  [FailedLogType.InvalidParameters]: 'Invalid Parameters',
};

export const TerminalSwitchFailedLogsSource: Array<ChooseInterface> = [
  {
    label: 'All sources',
    value: '',
  },
  {
    label: 'Setel',
    value: TerminalSwitchTransactionSource.SETEL,
  },
  {
    label: 'Invenco',
    value: TerminalSwitchTransactionSource.INVENCO,
  },
];
