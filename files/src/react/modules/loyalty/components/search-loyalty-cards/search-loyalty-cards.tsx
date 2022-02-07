import * as React from 'react';
import {IdType, translateIdTypeDropdown} from '../../loyalty-members.type';
import {MediaStatus} from '../../loyalty.type';
import {
  TextEllipsis,
  Card,
  CardContent,
  FieldContainer,
  useFilter,
  SearchTextInput,
  DropdownSelect,
  OptionsOrGroups,
  Filter,
  Badge,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  formatDate,
} from '@setel/portal-ui';
import {useSearchCards} from '../../loyalty.queries';

export const SearchLoyaltyCards = () => {
  const [{values, applied}, {setValueCurry, reset}] = useFilter({
    icType: undefined as undefined | IdType,
    icNumber: '',
  });

  const {validationMessage, isEnabled} = React.useMemo(() => {
    switch (values.icType) {
      case IdType.NEW_IC:
        return {
          validationMessage: 'Please input a valid IC number',
          isEnabled: /\d{12,13}/.test(values.icNumber),
        };

      case IdType.OLD_IC:
        return {
          validationMessage: 'Please input a valid IC number',
          isEnabled: /\d{5,8}/.test(values.icNumber),
        };

      case IdType.PASSPORT:
        return {
          validationMessage: 'Search box should not be empty',
          isEnabled: values.icNumber !== '',
        };

      default:
        return values.icNumber
          ? {validationMessage: 'Please select an id type', isEnabled: false}
          : {validationMessage: '', isEnabled: false};
    }
  }, [values]);

  const options: OptionsOrGroups<string | IdType> = [
    {label: translateIdTypeDropdown(IdType.NEW_IC), value: IdType.NEW_IC},
    {label: translateIdTypeDropdown(IdType.OLD_IC), value: IdType.OLD_IC},
    {label: translateIdTypeDropdown(IdType.PASSPORT), value: IdType.PASSPORT},
  ];

  const filters = React.useMemo(() => {
    return applied?.filter((apl) => apl.prop === 'icNumber');
  }, [applied]);

  const {data, isSuccess, isLoading, isError} = useSearchCards(values, {enabled: isEnabled});

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis
        className="flex-grow text-2xl pb-4"
        text="Search loyalty cards"
        widthClass="w-full"
      />
      <Card>
        <CardContent className="grid grid-cols-3 gap-4" data-testid="search-card">
          <FieldContainer
            helpText={
              values.icNumber && values.icType === undefined && !isEnabled && validationMessage
            }
            label="ID type"
            status={
              values.icNumber && values.icType === undefined && !isEnabled ? 'error' : undefined
            }>
            <DropdownSelect
              value={values.icType as string}
              className="w-full"
              onChangeValue={setValueCurry('icType')}
              placeholder="Please select"
              options={options}
              data-testid="id-type"
            />
          </FieldContainer>
          <FieldContainer
            className="col-span-2"
            helpText={
              values.icNumber !== undefined && values.icType && !isEnabled && validationMessage
            }
            label="Search"
            status={
              values.icNumber !== undefined && values.icType && !isEnabled ? 'error' : undefined
            }>
            <SearchTextInput
              value={values.icNumber ? values.icNumber : ''}
              placeholder="Search here..."
              onChangeValue={setValueCurry('icNumber')}
              data-testid="search-input"
            />
          </FieldContainer>
        </CardContent>
      </Card>

      {filters.length > 0 && (
        <Filter className="pt-8" onReset={reset}>
          {filters.map((item) => (
            <Badge onDismiss={reset} key={item.prop}>
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
                <Td>Account number</Td>
                <Td>Media ID</Td>
                <Td>Media type</Td>
                <Td>Media status</Td>
                <Td>Cardholder name</Td>
                <Td>Available point balance</Td>
                <Td>Media registration date</Td>
              </Tr>
            </DataTableRowGroup>
            {(isSuccess && !data?.cardsInfo?.length) || isError ? (
              <DataTableCaption
                className="text-center py-12 text-mediumgrey text-md"
                data-testid="no-loyalty-cards">
                <p>No loyalty cards found</p>
                <p>Try again with a different information type</p>
              </DataTableCaption>
            ) : (
              <DataTableRowGroup>
                {data?.cardsInfo?.map((card, index) => (
                  <Tr render={(props) => <div {...props} data-testid="card-row" />} key={index}>
                    <Td>{card.acctNo}</Td>
                    <Td>{card.mediaId}</Td>
                    <Td>{card.mediaType}</Td>
                    <Td>
                      <Badge
                        color={
                          card.mediaStatus === MediaStatus.ACTIVE
                            ? 'success'
                            : card.mediaStatus === MediaStatus.SUSPEND
                            ? 'warning'
                            : card.mediaStatus === MediaStatus.BLOCK
                            ? 'error'
                            : 'grey'
                        }
                        rounded="rounded"
                        className="uppercase">
                        {card.mediaStatus}
                      </Badge>
                    </Td>
                    <Td>{card.cardHolderName}</Td>
                    <Td>{card.availablePointBalance}</Td>
                    <Td>
                      {card.mediaRegistrationDate ? formatDate(card.mediaRegistrationDate) : '-'}
                    </Td>
                  </Tr>
                ))}
              </DataTableRowGroup>
            )}
          </DataTable>
        )}
      </div>
    </div>
  );
};
