import {createArray, getId, isFunction} from '@setel/portal-ui';
import type {rest} from 'msw';

export type JsonResolver = Parameters<typeof rest.post>[1];
export type Request = Parameters<JsonResolver>[0];

export const createFixResponseHandler =
  (response: any): JsonResolver =>
  (_, res, ctx) =>
    res(ctx.json(response));

export const createEmptyHandler = (): JsonResolver => (_, res, ctx) => res(ctx.status(200));

type DataSet<T> = T[] | ((req: Request) => T[]);

interface PaginationInfo<Data> {
  data: Data[];
  page: number;
  perPage: number;
  total: number;
  totalPage: number;
  nextPage: number;
}

interface PaginationHandlerOptions<Data> {
  bodyMapper?: (info: PaginationInfo<Data>) => any;
  headerMapper?: (info: PaginationInfo<Data>) => Record<string, string>;
}

export const createPaginationHandler =
  <Data>(
    dataSet: DataSet<Data>,
    {
      bodyMapper = (info) => info.data,
      headerMapper = (info) => ({
        'x-page': String(info.page),
        'x-per-page': String(info.perPage),
        'x-pages-count': String(info.totalPage),
        'x-total-count': String(info.total),
      }),
    }: PaginationHandlerOptions<Data> = {},
  ): JsonResolver =>
  (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const perPage = req.url.searchParams.get('perPage') || '10';
    const data = typeof dataSet === 'function' ? dataSet(req) : dataSet;

    const pageNumber = Number(page);
    const perPageCount = Number(perPage);
    const totalPage = Math.ceil(data.length / perPageCount);

    const info: PaginationInfo<Data> = {
      data: data.slice((pageNumber - 1) * perPageCount, pageNumber * perPageCount),
      page: pageNumber,
      perPage: perPageCount,
      total: data.length,
      totalPage,
      nextPage: perPageCount < totalPage ? perPageCount + 1 : perPageCount,
    };

    const body = bodyMapper(info);
    const headers = headerMapper(info);

    return res(
      ctx.json(body),
      ...Object.entries(headers).map(([prop, value]) => ctx.set(prop, value)),
    );
  };

export const createInfiniteHandler =
  <Data>(dataSet: DataSet<Data>, pageSize: number): JsonResolver =>
  (req, res, ctx) => {
    const pageToken = Number(req.url.searchParams.get('pageToken') || 1);
    const allData = isFunction(dataSet) ? dataSet(req) : dataSet;
    const data = allData.slice((pageToken - 1) * pageSize, pageToken * pageSize);
    const nextPageToken = pageToken * pageSize > allData.length ? null : pageToken + 1;
    return res(
      ctx.json({
        data,
        nextPageToken,
        total: allData.length,
      }),
    );
  };

const defaultDetailComparator = (param: any, dataIdValue: any): boolean => param === dataIdValue;

export const createDetailHandler =
  <Data extends {id?: string; _id?: string; key?: string}>(
    dataSet: Data[],
    idParam: string,
    {
      comparator = defaultDetailComparator,
      propToMatch = ['id', '_id', 'key'] as Array<keyof Data>,
    } = {},
  ): JsonResolver =>
  (req, res, ctx) => {
    const paramValue = req.params[idParam];

    const matchedItem = dataSet.find((s) =>
      propToMatch.some((prop) => comparator(paramValue, s[prop])),
    );

    if (!matchedItem) {
      return res(ctx.status(404));
    }

    return res(ctx.json(matchedItem));
  };

/**
 * Create mock data based on the provided samples. By default, `id` or `_id` field will be overwritten with random string.
 *
 * @param seeds sample data
 * @param recordCount number of total records to be created
 * @param overrides function to return an object to overwrite particular properties of the object
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const createMockData = <Data extends object>(
  seeds: Data[],
  recordCount: number,
  overrides: (seed: Data, index: number) => Partial<Data> = () => ({}),
): Data[] =>
  createArray(recordCount).map((_, index) => {
    if (index < seeds.length) {
      return seeds[index];
    }
    const id = getId();
    const record = seeds[index % seeds.length];
    const overriddenRecord = {
      ...record,
      ...overrides(record, index),
    };

    if ((overriddenRecord as any).id) {
      return {
        ...overriddenRecord,
        id,
      };
    }
    if ((overriddenRecord as any)._id) {
      return {
        ...overriddenRecord,
        _id: id,
      };
    }
    return overriddenRecord;
  });
