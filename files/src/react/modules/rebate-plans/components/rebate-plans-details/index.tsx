import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeading,
  DescItem,
  DescList,
  EditIcon,
  formatDate,
  PaginationNavigation,
  Skeleton,
  usePaginationState,
  DataTable as Table,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useRebatePlan} from '../../rebate-plans.queries';
import {EmptyDataTableCaption} from '../../../../components/empty-data-table-caption';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {formatMoney} from '@setel/web-utils';
import {ALL_CATEGORIES} from '../../rebate-plans.constant';
import {RebatePlansModalGeneralEdit} from './rebate-plans-edit-general-modal';
import {RebatePlansModalTierEdit} from './rebate-plans-edit-tiers-modal';
import {useMalaysiaTime} from '../../../billing-invoices/billing-invoices.helpers';
import {RebateSettingListing} from '../../../rebate-setting/component';
import {
  IRebatePlanDetailProps,
  ITierBase,
  rebatePlanTypes,
} from '../../../../services/api-rebates.type';

export const RebatePlanDetails = ({planId}: IRebatePlanDetailProps) => {
  const {data, isLoading, isError, error} = useRebatePlan(planId);
  const [rebateEditGeneralForm, setRebateEditGeneralForm] = React.useState(false);
  const [rebateEditTierForm, setRebateEditTierForm] = React.useState(false);
  const [showMoreCategory, setShowMoreCategory] = React.useState(false);
  const [categoryListShow, setCategoryListShow] = React.useState([]);
  const {page, setPage, perPage, setPerPage} = usePaginationState();

  React.useEffect(() => {
    if (data) {
      setCategoryListShow(
        !showMoreCategory ? data.loyaltyCategoryIds.slice(0, 10) : data.loyaltyCategoryIds,
      );
    }
  }, [showMoreCategory, data]);
  return (
    <PageContainer heading="Rebate plan details" className="space-y-8">
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <div>
          <Card isLoading={isLoading} className="mb-8">
            <CardHeading title="General">
              {data && (
                <Button
                  onClick={() => setRebateEditGeneralForm(true)}
                  variant="outline"
                  minWidth="none"
                  leftIcon={<EditIcon />}>
                  EDIT
                </Button>
              )}
            </CardHeading>
            <CardContent>
              <DescList>
                <DescItem label="Plan name" value={data ? data.planName : <Skeleton />} />
                <DescItem label="Plan ID" value={data ? data.planId : <Skeleton />} />
                <DescItem label="Rebate plan type" value={data ? data.type : <Skeleton />} />
                <DescItem
                  label="Loyalty category"
                  value={
                    data?.isAllLoyaltyCategoryIds ? (
                      ALL_CATEGORIES
                    ) : data?.loyaltyCategoryIds ? (
                      <div>
                        {categoryListShow.map((category, index) => (
                          <Badge
                            key={index}
                            className={'font-normal text-sm rounded-full mr-2 mb-2 py-2 px-4'}
                            color={'grey'}>
                            {category}
                          </Badge>
                        ))}
                        {data.loyaltyCategoryIds.length > 10 && (
                          <p
                            className={'flex items-center text w-40 text-brand-500 cursor-pointer'}
                            onClick={() => setShowMoreCategory(!showMoreCategory)}>
                            <span className="tracking-1 font-semibold text-xs">
                              {showMoreCategory ? 'VIEW LESS' : 'VIEW ALL'}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <Skeleton />
                    )
                  }
                />
                <DescItem label="Remarks" value={data?.remarks ? data.remarks : '-'} />
                <DescItem label="Created on" value={formatDate(useMalaysiaTime(data?.createdAt))} />
                <DescItem label="Created by" value={data ? data.createdBy : <Skeleton />} />
                <DescItem label="Updated on" value={formatDate(useMalaysiaTime(data?.updatedAt))} />
                <DescItem label="Updated by" value={data?.updatedBy ? data.updatedBy : '-'} />
              </DescList>
            </CardContent>
          </Card>

          <Table
            heading={
              <CardHeading title={'Tier'}>
                {data && (
                  <Button
                    onClick={() => setRebateEditTierForm(true)}
                    variant="outline"
                    minWidth="none"
                    leftIcon={<EditIcon />}>
                    EDIT
                  </Button>
                )}
              </CardHeading>
            }
            isLoading={isLoading}
            pagination={
              <PaginationNavigation
                total={data?.tiers.length}
                currentPage={page}
                perPage={perPage}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
              />
            }>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="w-1/5">TIER</Table.Th>
                <Table.Th className="w-1/5 text-right">{`MIN. VALUE ${
                  data?.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'
                }`}</Table.Th>
                <Table.Th className="w-1/5 text-right">{`MAX. VALUE ${
                  data?.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'
                }`}</Table.Th>
                <Table.Th className="w-1/5 text-right">
                  {`BASIC VALUE ${data?.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'}`}
                </Table.Th>
                <Table.Th className="w-1/5 text-right">BILLED VALUE (RM)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {data?.tiers.length !== 0 && (
              <Table.Tbody>
                {data?.tiers?.map((tier: ITierBase, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td className="text-right">
                      {formatMoney(tier.minimumValue, {decimalPlaces: 3})}
                    </Table.Td>
                    <Table.Td className="text-right">
                      {formatMoney(tier.maximumValue, {decimalPlaces: 3})}
                    </Table.Td>
                    <Table.Td className="text-right">
                      {formatMoney(tier.basicValue, {decimalPlaces: 3})}
                    </Table.Td>
                    <Table.Td className="text-right">
                      {formatMoney(tier.billedValue, {decimalPlaces: 3})}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            )}
            {data?.tiers.length === 0 && <EmptyDataTableCaption />}
          </Table>
          {data && <RebateSettingListing planId={+planId} />}
        </div>
      )}
      {rebateEditGeneralForm && (
        <RebatePlansModalGeneralEdit
          setShowModal={setRebateEditGeneralForm}
          rebatePlanDetail={data}
        />
      )}
      {rebateEditTierForm && (
        <RebatePlansModalTierEdit setShowModal={setRebateEditTierForm} rebatePlanDetail={data} />
      )}
    </PageContainer>
  );
};
