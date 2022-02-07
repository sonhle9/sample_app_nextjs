import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createBadgeGroup,
  updateBadgeGroup,
  getBadgeGroups,
  reorderBadgeGroups,
  deleteBadgeGroup,
  getUserBadges,
  getBadges,
  getBadgeDetailsById,
  createBadge,
  updateBadge,
  getBadgeIconGallery,
  getBadgeGroupBadges,
  getBadgeGroupById,
} from './badge-campaigns.service';
import {environment} from 'src/environments/environment';
import {arrayMove, useFileUploads, createUploadFileOperation} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import * as React from 'react';
import {
  IBadgeGroupInList,
  IBadgeStatus,
  UserBadgeStatus,
  IBadgeIconGalleryPayload,
  IBadgeGalleryIcon,
} from './badge-campaigns.type';
import {apiClient, ajax, selectError} from 'src/react/lib/ajax';
import type {AxiosError} from 'axios';

export const BADGE_GROUP_LIST_KEY = 'badge-group-list';
const BADGE_LIST_KEY = 'badge-list';
const BADGE_LIST_BY_BADGE_GROUP_KEY = 'badge-list-by-badge-group';
const BADGE_DETAILS_KEY = 'badge-details';
const ICON_GALLERY = 'icon-gallery';
const BADGE_GROUP_DETAILS = 'badge-group-details';

export const useCreateBadgeGroup = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(createBadgeGroup, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(BADGE_GROUP_LIST_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useUpdateBadgeGroup = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(updateBadgeGroup, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(BADGE_GROUP_LIST_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useDeleteBadgeGroup = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(deleteBadgeGroup, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(BADGE_GROUP_LIST_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully deleted!'})),
  });
};

export const useGetBadgeGroupById = (id: string) =>
  useQuery({
    queryKey: [BADGE_GROUP_DETAILS, id],
    queryFn: () => getBadgeGroupById(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });

export const useGetBadgeDetailsById = (id: string) =>
  useQuery([BADGE_DETAILS_KEY, id], () => getBadgeDetailsById(id));

export const useBadgeList = () =>
  useDataTableState({
    initialFilter: {status: '', createdOn: ['', ''], searchProp: '', searchValue: ''},
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: [
            {value: '', label: 'All statuses'},
            {value: 'ACTIVE', label: 'Launched'},
            {value: 'INACTIVE', label: 'Stopped'},
            {value: 'DRAFT', label: 'Draft'},
            {value: 'ARCHIVED', label: 'Archived'},
          ],
          wrapperClass: 'md:col-span-1',
        },
      },
      {
        key: 'createdOn',
        type: 'daterange',
        props: {
          label: 'Created on',
          dayOnly: true,
          wrapperClass: 'md:col-span-2',
        },
      },
      {
        key: 'searchProp',
        type: 'select',
        props: {
          label: 'Search by',
          options: [
            {value: '', label: 'All'},
            {value: 'badgeName', label: 'Badge name'},
            {value: 'campaignName', label: 'Badge label'},
            {value: 'tags', label: 'Tags'},
          ],
          wrapperClass: 'md:col-span-1 md:col-start-1',
        },
      },
      {
        key: 'searchValue',
        type: 'search',
        props: {placeholder: 'Enter keyword...', wrapperClass: 'md:col-span-2'},
      },
    ],
    queryKey: BADGE_LIST_KEY,
    keepPreviousData: true,
    queryFn: ({page, perPage, status, createdOn: [fromDate, toDate], searchValue, searchProp}) =>
      getBadges({
        page,
        perPage,
        fromDate: !!fromDate ? fromDate : undefined,
        toDate: !!toDate ? toDate : undefined,
        status: !!status ? (status as IBadgeStatus) : undefined,
        ...(searchProp === '' ? {all: searchValue} : {[searchProp]: searchValue}),
      }),
  });

export const useBadgeGroupBadgeList = (enabled?: boolean) =>
  useDataTableState({
    initialFilter: {id: ''},
    propExcludedFromParams: ['id'],
    queryKey: BADGE_LIST_BY_BADGE_GROUP_KEY,
    refetchOnWindowFocus: false,
    enabled,
    queryFn: ({id, page, perPage}) => getBadgeGroupBadges({id, page, perPage}),
  });

export const useCreateBadge = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(createBadge, {
    onError: (err) => setNotify({variant: 'error', title: err.toString()}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(BADGE_LIST_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useUpdateBadge = ({hideNetworkError = false}: {hideNetworkError?: boolean} = {}) => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(updateBadge, {
    onError: hideNetworkError
      ? () => {}
      : (error: AxiosError) =>
          setNotify({variant: 'error', title: selectError(error, error.toString())}),
    onSuccess: () =>
      queryClient
        .invalidateQueries(BADGE_DETAILS_KEY)
        .then(() => setNotify({variant: 'success', title: 'Successfully saved!'})),
  });
};

export const useBadgeGroupSearch = ({name, enabled}: {name: string; enabled: boolean}) =>
  useQuery([BADGE_GROUP_LIST_KEY, name], () => getBadgeGroups({name}), {
    refetchOnWindowFocus: false,
    enabled: enabled && name.trim() !== '',
  });

export const useBadgeGroupList = () => {
  const setNotify = useNotification();
  const queryClient = useQueryClient();
  const {query, filter, pagination} = useDataTableState({
    initialFilter: {filterText: ''},
    components: [
      {
        key: 'filterText',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search for group name',
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
    queryKey: BADGE_GROUP_LIST_KEY,
    keepPreviousData: true,
    queryFn: ({filterText, page, perPage}) =>
      getBadgeGroups({
        page,
        perPage,
        sortDate: 'desc',
        name: filterText.trim() !== '' ? filterText.trim() : undefined,
      }),
  });

  const {data} = query;
  const [list, setList] = React.useState<Array<IBadgeGroupInList>>([]);
  React.useEffect(() => {
    if (data?.items) setList(data.items);
  }, [data?.items]);

  return {
    total: data?.total ?? 0,
    list,
    resetList: () => setList(data?.items),
    reorderList: ({oldIndex, newIndex}) =>
      setList((oldList) =>
        arrayMove(oldList, oldIndex, newIndex).map((item, index) => ({
          ...item,
          score: oldList[index].score,
        })),
      ),
    mutateList: () =>
      reorderBadgeGroups(list.map(({id, score}) => ({id, score})))
        .then(() => {
          setNotify({title: 'Successfully saved!', variant: 'success'});
          queryClient.invalidateQueries(BADGE_GROUP_LIST_KEY);
        })
        .catch((err) => setNotify({title: err.toString(), variant: 'error'})),
    isFetching: query.isFetching,
    filter,
    pagination,
  };
};

export const useUserBadgeList = (userId: string) =>
  useDataTableState({
    initialFilter: {},
    queryKey: 'user-badge-list',
    keepPreviousData: true,
    queryFn: ({page, perPage}) => getUserBadges({userId, page, perPage}),
  });

export const useGetIconGallery = ({
  enabled,
  ...params
}: IBadgeIconGalleryPayload & {enabled: boolean}) => {
  const queryClient = useQueryClient();
  return useQuery([ICON_GALLERY, params], () => getBadgeIconGallery(params), {
    enabled,
    placeholderData: () =>
      queryClient.getQueryData<{
        data: IBadgeGalleryIcon[];
      }>([ICON_GALLERY], {exact: false})?.data,
  });
};

export const useUploadBadgeIcon = (status: UserBadgeStatus) => {
  const queryClient = useQueryClient();
  const {items, addFile, hasPendingRequest} = useFileUploads({
    uploadOperation: createUploadFileOperation(
      (file) => {
        const data = new FormData();
        data.append('status', status);
        data.append('icon', file);
        return {
          url: `${environment.apiBaseUrl}/api/rewards/admin/badges/icon/upload`,
          method: 'POST',
          data,
        };
      },
      {
        axios: apiClient,
        selectResult: (res, file) => ({...res.data, fileName: file.name}),
      },
    ),
    validateBeforeUpload: (file) =>
      file.size > 10 * 1024 * 1024
        ? 'File size too big. The maximum supported file size is 10MB.'
        : undefined,
    onChange: () => queryClient.invalidateQueries(ICON_GALLERY),
    removeWhenComplete: true,
  });

  return {addFile, hasPendingRequest, items};
};

export const useDeleteGalleryIcon = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (id: IBadgeGalleryIcon['id']) =>
      ajax.delete(`${environment.apiBaseUrl}/api/rewards/admin/badges/icon/${id}`),
    {onSuccess: () => queryClient.invalidateQueries(ICON_GALLERY)},
  );
};
