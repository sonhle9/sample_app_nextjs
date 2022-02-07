import {useMutation, useQuery} from 'react-query';
import {getTransactions, sendEmail} from './reload-transactions.service';
import {IReloadTransactionRequest, IEmailTransactionInput} from './reload-transactions.type';

export const useListCollections = (filter: Parameters<typeof getTransactions>[0]) => {
  return useQuery(['GetListReloadTransactions', filter], () => getTransactions(filter), {
    keepPreviousData: true,
  });
};

export const useSendEmails = () =>
  useMutation((data: IEmailTransactionInput & IReloadTransactionRequest) => sendEmail(data));
