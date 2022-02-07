import {useQuery, UseQueryOptions} from 'react-query';
import {validateVoucher} from 'src/react/services/api-vouchers.service';
import {IVouchersInfo} from 'src/shared/interfaces/vouchers.interface';

const VALIDATE_VOUCHER = 'vaildate_voucher';

export const useValidateVoucher = (
  code: string,
  options?: UseQueryOptions<IVouchersInfo, unknown>,
) => useQuery([VALIDATE_VOUCHER, code], () => validateVoucher(code), options);
