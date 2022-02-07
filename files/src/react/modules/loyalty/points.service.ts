import {environment} from 'src/environments/environment';
import {extractError, apiClient} from 'src/react/lib/ajax';
import {AxiosResponse} from 'axios';
import {PointsTransactionsQuery, Transaction} from './points.type';
import {PaginationMetadata} from 'src/shared/interfaces/pagination.interface';
import {deleteEmptyKeys} from 'src/shared/helpers/parseJSON';

const pointsBaseURL = `${environment.variablesBaseUrl}/api/points`;

export const getTransactions = (params?: Partial<PointsTransactionsQuery>) => {
  deleteEmptyKeys(params);

  return apiClient
    .get(`${pointsBaseURL}/transactions`, {params})
    .then((res: AxiosResponse<PaginationMetadata<Transaction[]>>) => res.data)
    .catch((e) => extractError(e));
};
