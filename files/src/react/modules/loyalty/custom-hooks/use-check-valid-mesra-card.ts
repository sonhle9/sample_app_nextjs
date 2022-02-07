import {useGetLoyaltyAccount} from '../loyalty.queries';
import {isValidMesra} from 'src/shared/helpers/check-valid-id';
import {AxiosError} from 'axios';
import {MemberStatus} from '../loyalty-members.type';

export const useCheckValidMesraCardForTransfer = (cardNumber: string) => {
  const {data, isSuccess, isLoading, isError, error} = useGetLoyaltyAccount(cardNumber, {
    enabled: isValidMesra(cardNumber),
    retry: false,
  });

  const isValid =
    isValidMesra(cardNumber) && data?.cardAccountStatus !== MemberStatus.FROZEN && isSuccess;

  const errorMessage =
    isError || (isSuccess && !isValid)
      ? (error as AxiosError)?.response?.data?.message || 'Card is not valid'
      : null;

  return {
    data,
    isSuccess,
    isLoading,
    isError,
    isValid,
    errorMessage,
  };
};
