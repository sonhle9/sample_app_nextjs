import {useGetTransactionsByUserId, useGetTransactionsByCardNumber} from '../loyalty.queries';
import {Member, MemberType} from '../loyalty-members.type';

export const useGetTranscationsByMemberType = (
  member: Member,
  {
    page,
    perPage,
    startDate,
    endDate,
  }: {page: number; perPage: number; startDate: string; endDate: string},
) => {
  const memberUserId = member?.memberType === MemberType.SETEL && member?.userId;
  const memberCardNumber = member?.memberType !== MemberType.SETEL && member?.cardNumber;

  const {
    data: userIdData,
    isSuccess: userIdSuccess,
    isLoading: userIdLoading,
  } = useGetTransactionsByUserId(memberUserId, {
    page,
    perPage,
    startDate,
    endDate,
  });
  const {
    data: cardNumberData,
    isSuccess: cardSuccess,
    isLoading: cardLoading,
  } = useGetTransactionsByCardNumber(memberCardNumber, {page, perPage, startDate, endDate});

  const data = (memberUserId && userIdData) || (memberCardNumber && cardNumberData);
  const isSuccess = (memberUserId && userIdSuccess) || (memberCardNumber && cardSuccess);
  const isLoading = (memberUserId && userIdLoading) || (memberCardNumber && cardLoading);

  return {
    data,
    isSuccess,
    isLoading,
  };
};
