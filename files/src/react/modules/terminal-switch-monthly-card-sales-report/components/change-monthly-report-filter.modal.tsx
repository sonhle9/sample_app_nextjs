import {
  Alert,
  Button,
  Card,
  CardContent,
  classes,
  DescList,
  DropdownSelect,
  Modal,
  ModalBody,
  ModalFooter,
  MonthSelector,
  SearchableDropdown,
  Text,
} from '@setel/portal-ui';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {SkeletonDescItem} from 'src/react/components/skeleton-display';
import {useGetMerchants, useMerchantDetails} from '../../merchants/merchants.queries';
import {MonthlyCardSalesReportCardTypeOptions} from '../constant';
import {IMonthlyCardSalesReportFilter} from '../terminal-switch-monthly-card-sales-report.type';

export const MonthlyCardSalesReportFilterModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  filter: IMonthlyCardSalesReportFilter;
  setFilter: Dispatch<SetStateAction<IMonthlyCardSalesReportFilter>>;
}) => {
  const [cardBrand, setCardBrand] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [enableFilter, setEnableFilter] = useState(false);

  const [startMonthAndYear, setStartMonthAndYear] = useState<Date>();
  const [endMonthAndYear, setEndMonthAndYear] = useState<Date>();
  const {data: merchant} = useMerchantDetails(merchantId);

  const onFilterButtonClick = () => {
    props.setFilter({
      cardBrand,
      merchantId: merchant?.id,
      merchantName: merchant?.name,
      startMonth: startMonthAndYear?.getMonth() + 1,
      startYear: startMonthAndYear?.getFullYear(),
      endMonth: endMonthAndYear?.getMonth() + 1,
      endYear: endMonthAndYear?.getFullYear(),
    });
    props.onClose();
  };

  React.useEffect(() => {
    setEndMonthAndYear(undefined);
  }, [startMonthAndYear]);

  React.useEffect(() => {
    if (startMonthAndYear && endMonthAndYear) {
      const monthDistance =
        (endMonthAndYear.getFullYear() - startMonthAndYear.getFullYear()) * 12 +
        (endMonthAndYear.getMonth() - startMonthAndYear.getMonth());
      if (monthDistance >= 0 && monthDistance <= 24) {
        setEnableFilter(true);
        return;
      }
    }
    setEnableFilter(false);
  }, [startMonthAndYear, endMonthAndYear]);

  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const onCardBrandChangeValue = (data: string) => {
    setCardBrand(data);
  };

  const maxEndDate = new Date(
    startMonthAndYear?.getFullYear() + 2,
    startMonthAndYear?.getMonth() - 1,
  );

  const {data: merchants} = useGetMerchants({name: merchantSearchValue});

  return (
    <Modal
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-0 max-w-full w-1/2"
      isOpen={props.isOpen}
      onDismiss={props.onClose}
      header="Filter monthly card sales report">
      <ModalBody className="pb-0 md:pt-6 lg:pt-7">
        <Alert
          className="mb-7"
          variant="info"
          description="Date filter only support up to 24 months"
        />
        <Card className="shadow-none overflow-visible">
          <Card.Content className="flex p-0 pb-5">
            <div className={`${classes.label} w-44 mr-11 flex items-center`}>
              <Text color="lightgrey">TIME RANGE</Text>
            </div>
            <DescList className="flex-1 items-center gap-y-0">
              <SkeletonDescItem
                className="mb-5"
                label={`Start month & year`}
                value={
                  <MonthSelector
                    data-testid="select-start-month"
                    className="w-1/2"
                    disableFuture={true}
                    value={startMonthAndYear}
                    onChangeValue={setStartMonthAndYear}
                    labelType={'monthAndYear'}
                    emptyValue={'Select month & year'}
                  />
                }
                isLoading={false}
              />
            </DescList>
          </Card.Content>

          <CardContent className="flex border-b-2 p-0 pb-7">
            <div className={`${classes.label} w-44 mr-11 flex items-center`}></div>
            <DescList className="flex-1 items-center gap-y-0">
              <SkeletonDescItem
                label={`End month & year`}
                value={
                  <MonthSelector
                    data-testid="select-end-month"
                    className="w-1/2"
                    disabled={!startMonthAndYear}
                    value={endMonthAndYear}
                    maxDate={maxEndDate > new Date() ? new Date() : maxEndDate}
                    minDate={startMonthAndYear}
                    disableFuture={true}
                    onChangeValue={setEndMonthAndYear}
                    labelType={'monthAndYear'}
                    emptyValue={'Select month & year'}
                  />
                }
                isLoading={false}
              />
            </DescList>
          </CardContent>

          <Card.Content className="flex border-b-2 py-8 px-0">
            <Text className={`${classes.label} w-44 mr-11 self-center`} color="lightgrey">
              CARD (OPTIONAL)
            </Text>
            <DescList className="flex-1 items-center">
              <SkeletonDescItem
                label="Card type"
                value={
                  <DropdownSelect
                    className="w-3/5"
                    options={MonthlyCardSalesReportCardTypeOptions}
                    value={cardBrand}
                    placeholder={'Any card types'}
                    onChangeValue={onCardBrandChangeValue}
                  />
                }
                isLoading={false}
              />
            </DescList>
          </Card.Content>

          <Card.Content className="flex border-gray-200 py-7 px-0">
            <Text className={`${classes.label} w-44 mr-11 self-center`} color="lightgrey">
              MERCHANT (OPTIONAL)
            </Text>
            <DescList className="flex-1 items-center">
              <SkeletonDescItem
                label="Name/ID"
                value={
                  <SearchableDropdown
                    className="w-full"
                    placeholder="Search by Merchant Name/ID"
                    onInputValueChange={setMerchantSearchValue}
                    options={merchants}
                    value={merchantId}
                    onChangeValue={setMerchantId}
                  />
                }
                isLoading={false}
              />
            </DescList>
          </Card.Content>
        </Card>
      </ModalBody>
      <div className="">
        <ModalFooter className="flex justify-between self-center rounded-b-lg">
          <div className="flex-grow text-right self-center">
            <Button onClick={props.onClose} variant="outline" className="mr-2">
              CANCEL
            </Button>
            <Button
              data-testid="filter-button"
              type={'submit'}
              variant="primary"
              onClick={onFilterButtonClick}
              disabled={!enableFilter}>
              FILTER
            </Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
};
