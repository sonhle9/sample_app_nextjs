import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

export const apiClient = axios.create();

export interface AjaxOptions<Result = any> extends AxiosRequestConfig {
  select?: (res: AxiosResponse) => Result | Promise<Result>;
}

const defaultSelect: AjaxOptions['select'] = (res) => res.data;

/**
 * a wrapper over `apiClient` that works well with `react-query` to allow request cancellation.
 *
 * It will get the body of the response by default, but you can overwrite what is the response
 * using `select` options. Do not chain the promise with `.then` as it will not allow request
 * cancellation by `react-query` anymore.
 */
const ajaxFn = <Result = any>({select = defaultSelect, ...config}: AjaxOptions<Result>) => {
  const cancelSource = axios.CancelToken.source();

  const requestPromise = new Promise<Result>((fulfill, reject) => {
    apiClient({
      cancelToken: cancelSource.token,
      ...config,
    })
      .then((res) => fulfill(select(res)))
      .catch((err) => {
        if (!err || !axios.isCancel(err)) {
          reject(err);
        }
      });
  });

  return Object.assign(requestPromise, {
    cancel: () => cancelSource.cancel(),
  });
};

const ajaxAll = <Result = any>(ajaxs: Array<ReturnType<typeof ajaxFn>>) => {
  const result = Promise.all(ajaxs as Array<Promise<Result>>);

  return Object.assign(result, {
    cancel: () => ajaxs.forEach((aj) => aj.cancel()),
  });
};

type AjaxHelperOptions = Omit<AjaxOptions, 'url' | 'method'>;

export const ajax = Object.assign(ajaxFn, {
  get: <Result = any>(url: string, options: AjaxHelperOptions = {}) =>
    ajaxFn<Result>({url, ...options}),
  post: <Result = any>(url: string, data?: any, options: AjaxHelperOptions = {}) =>
    ajaxFn<Result>({url, data, method: 'post', ...options}),
  put: <Result = any>(url: string, data?: any, options: AjaxHelperOptions = {}) =>
    ajaxFn<Result>({url, data, method: 'put', ...options}),
  patch: <Result = any>(url: string, data?: any, options: AjaxHelperOptions = {}) =>
    ajaxFn<Result>({url, data, method: 'patch', ...options}),
  delete: <Result = any>(url: string, options: AjaxHelperOptions = {}) =>
    ajaxFn<Result>({url, method: 'delete', ...options}),
  all: ajaxAll,
  isAxiosError: axios.isAxiosError,
  isCancel: axios.isCancel,
});

/**
 * Axios without `access-token`
 */
export const apiClientWithoutAuth = axios;

/**
 * use `ajax` instead.
 */
export const getData = <Data>(url: string, config: AxiosRequestConfig = {}) =>
  ajax<Data>({
    url,
    method: 'GET',
    ...config,
  });

export interface IPaginationParam {
  perPage?: number;
  page?: number;
}
export interface IPaginationResult<Result> {
  items: Result[];
  isEmpty: boolean;
  page: number;
  perPage: number;
  pageCount: number;
  total: number;
}

export const fetchPaginatedData = <Result>(
  url: string,
  pagination: IPaginationParam,
  options: AxiosRequestConfig = {},
) =>
  ajax<IPaginationResult<Result>>({
    url,
    ...options,
    params: {
      ...pagination,
      ...options.params,
    },
    select: ({data, headers}) => {
      const items = data || [];

      return {
        items,
        isEmpty: items.length === 0,
        page: +headers['x-page'] || 0,
        perPage: +headers['x-per-page'] || 0,
        pageCount: +headers['x-pages-count'] || 0,
        total: +headers['x-total-count'] || 0,
      };
    },
  });

export const selectError = (error: AxiosError, fallbackMessage?: string) =>
  error.response?.data.message || fallbackMessage;

export const extractError = (error: AxiosError) => {
  throw new Error(selectError(error));
};

export const extractErrorJSON = (error: AxiosError) => {
  throw new Error(JSON.stringify(error.response?.data));
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const filterEmptyString = (params: object) => {
  const result: any = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '') {
      result[key] = value;
    }
  });

  return result;
};
