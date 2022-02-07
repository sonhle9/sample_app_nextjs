import {apiClient, getData} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {
  IPaginationParam,
  IPaginationResult,
  ITag,
  ICreateVariableInput,
  IVariable,
  IVariablesFilter,
  IVariableHistory,
  ITargetingOptions,
} from './types';

const baseUrl = `${environment.variablesBaseUrl}/api/variables`;

export function getVariables(
  pagination: IPaginationParam,
  filter: IVariablesFilter,
): Promise<IPaginationResult<IVariable[]>> {
  return getData<IPaginationResult<IVariable[]>>(`${baseUrl}/admin/variables/all`, {
    params: {
      ...pagination,
      ...filter,
    },
  });
}

// Tags API not present. Instead of hardcoding in code, getting tags by collecting all tags from variables.tags
export async function getTags(): Promise<ITag[]> {
  const pagination: IPaginationParam = {
    currentPage: 1,
    pageSize: 1000,
  };

  const variables = await apiClient.get(`${baseUrl}/admin/variables/all`, {
    params: {
      ...pagination,
    },
  });

  const tags = [];
  const tagsMap = {};
  variables.data.data.map((variable: IVariable) => {
    if (variable.tags) {
      variable.tags.forEach((tag: ITag) => {
        tagsMap[tag.key] = tag.value;
      });
    }
  });

  Object.entries(tagsMap).map(([key, value]) => {
    tags.push({key, value});
  });

  return Promise.resolve(tags);
}

export async function getVariable(id: string): Promise<IVariable> {
  const url = `${baseUrl}/admin/variables/${encodeURIComponent(id)}`;
  return getData(url);
}

export async function createVariable(input: ICreateVariableInput): Promise<IVariable> {
  const url = `${baseUrl}/admin/variables`;
  const res = await apiClient.post(url, input);
  return res.data;
}

export async function updateVariable({
  key,
  variable,
}: {
  key: string;
  variable: Partial<IVariable>;
}): Promise<IVariable> {
  const url = `${baseUrl}/admin/variables/${encodeURIComponent(key)}`;
  return apiClient.put(url, variable).then((res) => res.data);
}

export async function deleteVariable({key}: {key: string}) {
  const url = `${baseUrl}/admin/variables/${encodeURIComponent(key)}`;
  return apiClient.delete(url).then((res) => res.data);
}

export async function getVariableHistory(
  id: string,
  pagination: IPaginationParam,
): Promise<IPaginationResult<IVariableHistory[]>> {
  const url = `${baseUrl}/admin/variables/${encodeURIComponent(id)}/history`;
  return getData(url, {params: pagination});
}

export async function getTargetingOptions(): Promise<ITargetingOptions> {
  const url = `${baseUrl}/admin/variables/targeting-options`;
  return getData(url);
}
