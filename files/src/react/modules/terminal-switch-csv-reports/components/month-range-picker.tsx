import {
  Button,
  Card,
  CardContent,
  DescList,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  Modal,
  ModalBody,
  ModalFooter,
  MonthSelector,
  Text,
} from '@setel/portal-ui';
import React, {Dispatch, SetStateAction} from 'react';
import {SkeletonDescItem} from 'src/react/components/skeleton-display';

export const MonthRangePicker = (props: {
  setStartMonth: Dispatch<SetStateAction<Date>>;
  setEndMonth: Dispatch<SetStateAction<Date>>;
}) => {
  const [startMonth, setStartMonth] = React.useState<Date>(null);
  const [endMonth, setEndMonth] = React.useState<Date>(null);
  const [searchBarText, setSearchBarText] = React.useState('All years');
  const [showModal, setShowModal] = React.useState(false);

  const setStartMonthAndEndMonth = (start: Date, end: Date) => {
    props.setStartMonth(start);
    props.setEndMonth(end);
  };

  const onClickAllYear = () => {
    setStartMonth(null);
    setEndMonth(null);
    setStartMonthAndEndMonth(null, null);
    setSearchBarText('All years');
  };

  const onClickThisYear = () => {
    const beginOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date(beginOfYear.toString()).setMonth(11));
    setStartMonth(beginOfYear);
    setEndMonth(endOfYear);
    setStartMonthAndEndMonth(beginOfYear, endOfYear);
    setSearchBarText('This year');
  };

  const onClickLastYear = () => {
    const beginOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(new Date(beginOfLastYear.toString()).setMonth(11));
    setStartMonth(beginOfLastYear);
    setEndMonth(endOfLastYear);
    setStartMonthAndEndMonth(beginOfLastYear, endOfLastYear);
    setSearchBarText('Last year');
  };

  const onClickCustomDate = () => {
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const onFilterButtonClick = () => {
    setSearchBarText('Custom date');
    setShowModal(false);
    const startMonthString = startMonth.toLocaleDateString('default', {month: 'short'});
    const startYearString = startMonth.getFullYear();
    const endMonthString = endMonth.toLocaleDateString('default', {month: 'short'});
    const endYearString = endMonth.getFullYear();
    const searchText = `${startMonthString} ${startYearString} - ${endMonthString} ${endYearString}`;
    setStartMonthAndEndMonth(startMonth, endMonth);
    setSearchBarText(searchText);
  };

  return (
    <>
      <DropdownMenu
        className="w-72 border"
        label={
          <Text className="leading-1 text-sm text-black text-left w-full font-normal">
            {searchBarText}
          </Text>
        }>
        <DropdownMenuItems className="w-72">
          <DropdownItem className="w-72" onSelect={onClickAllYear}>
            <Text className="leading-5 text-sm text-black text-left w-full">All years</Text>
          </DropdownItem>
          <DropdownItem onSelect={onClickThisYear}>
            <Text className="leading-5 text-sm text-black text-left w-full">This year</Text>
          </DropdownItem>
          <DropdownItem onSelect={onClickLastYear}>
            <Text className="leading-5 text-sm text-black text-left w-full">Last year</Text>
          </DropdownItem>
          <DropdownItem onSelect={onClickCustomDate}>
            <Text className="leading-5 text-sm text-black text-left w-full">Custom date</Text>
          </DropdownItem>
        </DropdownMenuItems>
      </DropdownMenu>
      {showModal && (
        <Modal
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0 max-w-full w-2/5"
          header="Custom date"
          isOpen={true}
          onDismiss={onCloseModal}>
          <ModalBody className="pb-0 md:pt-6 lg:pt-7">
            <Card className="shadow-none overflow-visible">
              <Card.Content className="flex p-0 pb-4">
                <DescList className="flex-1 items-center gap-y-0">
                  <SkeletonDescItem
                    className="mb-5"
                    label={`Start month`}
                    value={
                      <MonthSelector
                        data-testid="select-start-month"
                        className="w-1/2"
                        disableFuture={true}
                        value={startMonth}
                        onChangeValue={(value) => {
                          setStartMonth(value);
                          setEndMonth(null);
                        }}
                        labelType={'monthAndYear'}
                        emptyValue={'Select month & year'}
                      />
                    }
                    isLoading={false}
                  />
                </DescList>
              </Card.Content>

              <CardContent className="flex border-b-2 p-0 pb-7">
                <DescList className="flex-1 items-center gap-y-0">
                  <SkeletonDescItem
                    label={`End month`}
                    value={
                      <MonthSelector
                        data-testid="select-end-month"
                        className="w-1/2"
                        disabled={!startMonth}
                        value={endMonth}
                        maxDate={new Date()}
                        minDate={startMonth}
                        disableFuture={true}
                        onChangeValue={(value) => {
                          setEndMonth(value);
                        }}
                        labelType={'monthAndYear'}
                        emptyValue={'Select month & year'}
                      />
                    }
                    isLoading={false}
                  />
                </DescList>
              </CardContent>
            </Card>
          </ModalBody>
          <div className="">
            <ModalFooter className="flex justify-between self-center rounded-b-lg">
              <div className="flex-grow text-right self-center">
                <Button onClick={onCloseModal} variant="outline" className="mr-2">
                  CANCEL
                </Button>
                <Button
                  data-testid="filter-button"
                  type={'submit'}
                  variant="primary"
                  onClick={onFilterButtonClick}
                  disabled={!(startMonth && endMonth)}>
                  SAVE CHANGES
                </Button>
              </div>
            </ModalFooter>
          </div>
        </Modal>
      )}
    </>
  );
};
