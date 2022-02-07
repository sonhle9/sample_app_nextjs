import * as React from 'react';
import {
  Card,
  CardContent,
  DropdownSelect,
  SearchTextInput,
  FieldContainer,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  Filter,
  Badge,
  useFilter,
  Button,
  OptionsOrGroups,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {
  Member,
  MemberStatus,
  translateMemberStatus,
  IdType,
  translateIdTypeDropdown,
  SearchIdTypes,
} from '../../loyalty-members.type';
import {useGetLoyaltyMembers} from '../../loyalty.queries';
import {maskMesra, maskIDNumber} from 'src/shared/helpers/mask-helpers';
import {isValidMesra} from 'src/shared/helpers/check-valid-id';
import {removeDashes} from 'src/shared/helpers/format-text';

export const LoyaltyMembers = () => {
  const [{values, applied}, {setValue, reset}] = useFilter({
    idType: undefined as undefined | IdType,
    idRef: undefined as undefined | string,
  });

  const {validationMessage, isEnabled, params} = React.useMemo(() => {
    switch (values.idType) {
      case IdType.NEW_IC:
        return {
          validationMessage: 'Please input a valid IC number',
          isEnabled: /^\d{12,13}$/.test(values.idRef) || /^\d{5,8}$/.test(values.idRef),
          params: /\d{12,13}/.test(values.idRef)
            ? values
            : {idType: IdType.OLD_IC, idRef: values.idRef},
        };

      case IdType.PASSPORT:
        return {
          validationMessage: 'Search box should not be empty',
          isEnabled: values?.idRef?.length > 0,
          params: values,
        };

      case IdType.PHONE:
        return {
          validationMessage: 'Search box should not be empty',
          isEnabled: values?.idRef?.length > 0,
          params: {
            [IdType.PHONE]: values.idRef,
          },
        };

      case IdType.CARD_NUMBER:
        return {
          validationMessage: 'Please input a valid mesra card number',
          isEnabled: isValidMesra(values.idRef),
          params: {
            [IdType.CARD_NUMBER]: values.idRef,
          },
        };

      case IdType.EMAIL:
        return {
          validationMessage: 'Search box should not be empty',
          isEnabled: values?.idRef?.length > 0,
          params: {
            [IdType.EMAIL]: values.idRef,
            memberStatus: MemberStatus.ACTIVE,
          },
        };

      default:
        return values.idRef
          ? {validationMessage: 'Please select an id type', isEnabled: false}
          : {validationMessage: '', isEnabled: false};
    }
  }, [values]);

  const {
    data,
    isSuccess,
    isError,
    isLoading,
    fetchNextPage: fetchMore,
    hasNextPage: canFetchMore,
    isFetching,
  } = useGetLoyaltyMembers(params, {
    enabled: isEnabled,
  });

  const onReset = () => {
    reset();
  };

  const filters = React.useMemo(() => {
    return applied?.filter((apl) => apl.prop !== 'idType');
  }, [applied]);

  const paginatedData = React.useMemo(() => {
    return data?.pages.flatMap((response) => response.data);
  }, [data]);

  const options: OptionsOrGroups<string | IdType> = Object.values(SearchIdTypes).map((value) => ({
    label: translateIdTypeDropdown(value as unknown as IdType),
    value,
  }));

  return (
    <PageContainer heading="Loyalty members">
      <Card>
        <CardContent className="grid grid-cols-3 gap-4" data-testid="search-card">
          <FieldContainer
            helpText={
              values.idRef && values.idType === undefined && !isEnabled && validationMessage
            }
            label="Search by"
            status={
              values.idRef && values.idType === undefined && !isEnabled ? 'error' : undefined
            }>
            <DropdownSelect
              value={values.idType as string}
              className="w-full"
              onChangeValue={(value) => setValue('idType', value as unknown as IdType)}
              placeholder="Please select"
              options={options}
              data-testid="id-type"
            />
          </FieldContainer>
          <FieldContainer
            className="col-span-2"
            helpText={
              values.idRef !== undefined && values.idType && !isEnabled && validationMessage
            }
            label="Search"
            status={
              values.idRef !== undefined && values.idType && !isEnabled ? 'error' : undefined
            }>
            <SearchTextInput
              value={values.idRef ? values.idRef : ''}
              placeholder="Search here..."
              onChangeValue={(value) => setValue('idRef', removeDashes(value))}
              data-testid="search-input"
            />
          </FieldContainer>
        </CardContent>
      </Card>

      {filters.length > 0 && (
        <Filter className="pt-8" onReset={onReset}>
          {filters.map((item) => (
            <Badge onDismiss={onReset} key={item.prop}>
              {item.label}
            </Badge>
          ))}
        </Filter>
      )}

      <div className="mt-8">
        {(isSuccess || isLoading) && (
          <DataTable isLoading={isLoading} skeletonRowNum={3}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Card number</Td>
                <Td>Status</Td>
                <Td>Member name</Td>
                <Td>id number</Td>
                <Td>Phone number</Td>
              </Tr>
            </DataTableRowGroup>
            {isSuccess ? (
              paginatedData?.length > 0 ? (
                <DataTableRowGroup>
                  {paginatedData.map((value: Member) => {
                    return (
                      <Tr
                        render={(props) => (
                          <a
                            {...props}
                            href={`/loyalty/members/${value.id}`}
                            data-testid="members-row"
                          />
                        )}
                        key={value.id}>
                        <Td>{value.cardNumber ? maskMesra(value.cardNumber) : '-'}</Td>
                        <Td>
                          <Badge
                            color={
                              value.memberStatus === MemberStatus.ACTIVE
                                ? 'success'
                                : value.memberStatus === MemberStatus.ISSUED ||
                                  value.memberStatus === MemberStatus.FROZEN_TEMP
                                ? 'warning'
                                : 'grey'
                            }
                            rounded="rounded"
                            className="uppercase">
                            {translateMemberStatus(value.memberStatus)}
                          </Badge>
                        </Td>
                        <Td className="capitalize">
                          {value.name ? value.name.toLowerCase() : '-'}
                        </Td>
                        <Td>{value.idRef ? maskIDNumber(value.idRef) : '-'}</Td>
                        <Td>{value.mobileNo ? value.mobileNo : '-'}</Td>
                      </Tr>
                    );
                  })}
                </DataTableRowGroup>
              ) : (
                <DataTableCaption
                  className="text-center py-12 text-mediumgrey text-md"
                  data-testid="no-members">
                  <p>No records found</p>
                  <p>Try again with a different information type</p>
                </DataTableCaption>
              )
            ) : (
              <DataTableRowGroup data-testid="loading" />
            )}
          </DataTable>
        )}
        {canFetchMore && (
          <div className="pt-8 flex justify-center">
            <Button variant="outline" onClick={() => fetchMore()} isLoading={isFetching}>
              LOAD MORE
            </Button>
          </div>
        )}
        {isError && <div data-testid="error">Error</div>}
      </div>
    </PageContainer>
  );
};
