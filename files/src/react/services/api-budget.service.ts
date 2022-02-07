import {environment} from 'src/environments/environment';
import {ajax, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';
import {IBudget, ICustomBudget} from 'src/shared/interfaces/customer.interface';

const baseUrl = `${environment.budgetApiBaseUrl}/api/budgets`;

export const indexMonthlyStatementSummaryByUserId = (
  userId: string,
  pagination?: IPaginationParam,
) =>
  fetchPaginatedData<IBudget>(
    `${baseUrl}/admin/statements/users/${userId}/statements/summary`,
    pagination,
  );

export const emailStatementSummaryByUserId = (userId: string, params: ICustomBudget) =>
  ajax.post(`${baseUrl}/admin/statements/users/${userId}/statements/email`, params);
