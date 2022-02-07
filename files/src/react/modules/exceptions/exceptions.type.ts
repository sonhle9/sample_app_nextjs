import {PosBatchUploadReportFailType} from 'src/react/services/api-settlements.type';

export const defaultSettingPage = {
  defaultPage: 1,
  defaultPerPage: 50,
};

export function RemarkType(status: string): Remarks {
  switch (status) {
    case PosBatchUploadReportFailType.ONLY_EXIST_ON_PLATFORM:
      return 'Records not existed in the terminal';
    case PosBatchUploadReportFailType.ONLY_EXIST_ON_TERMINAL:
      return 'Records not existed in the host';
    case PosBatchUploadReportFailType.AMOUNT_MISMATCH:
      return 'Amount not tally between host and station';
    default:
      return '';
  }
}

type Remarks =
  | 'Records not existed in the host'
  | 'Records not existed in the terminal'
  | 'Amount not tally between host and station'
  | '';
