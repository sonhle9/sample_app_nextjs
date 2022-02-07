import {
  Button,
  Card,
  DescList,
  EditIcon,
  ExternalIcon,
  Fieldset,
  formatDate,
  IconButton,
  DataTable as Table,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {useRouter} from 'src/react/routing/routing.context';
import {indexRiskProfilesHistories} from 'src/react/services/api-risk-profiles.service';
import {adminRiskProfile} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {convertToOptions} from '../../ledger/fee-settings/fee-settings.const';
import {CreatingReason, IdentifierType} from '../risk-profile.enum';
import {cacheKeys, useRiskProfileDetails} from '../risk-profile.queries';
import {RiskProfileModal} from './risk-profile-modal';
import {countryOptions} from '../../risk-profile/risk-profile.const';
import {getMoneyFormat} from '../../billing-plans/billing-plan.utils';

export const RiskProfileDetails = (props: {id: string}) => {
  const riskProfileId = props.id;
  const {data, isLoading: isLoadingRiskProfileDetails} = useRiskProfileDetails(riskProfileId);

  const {
    query: {data: riskProfileHistories, isLoading: isLoadingRiskProfileHistories, isFetching},
    pagination,
  } = useDataTableState({
    queryKey: cacheKeys.riskProfilesHistories,
    queryFn: (pagination) => indexRiskProfilesHistories(riskProfileId, pagination),
    initialFilter: {},
  });
  const [isRiskProfileModalOpen, openModal] = React.useState(false);

  const router = useRouter();

  const TYPE_OF_ID_OPTIONS = convertToOptions(IdentifierType);

  const CHECK_FOR_OPTIONS = convertToOptions(CreatingReason);

  const mapTypeOfId = (value: string) => {
    return TYPE_OF_ID_OPTIONS.find((item) => item.value === value);
  };

  const mapCheckForReason = (value: string) => {
    return CHECK_FOR_OPTIONS.find((item) => item.value === value);
  };

  const mapCustomerNationality = (value: string) => {
    return countryOptions.find((item) => item.value === value);
  };

  const getTypeOfIdLabel = (idType: string): string => {
    const label = mapTypeOfId(idType)?.label;
    return label?.split(' ').join('');
  };

  const isLoading = isLoadingRiskProfileDetails && isLoadingRiskProfileHistories;

  return (
    <PageContainer heading="Risk profile details" data-testid="risk-profile-details">
      <div className="space-y-5">
        <Card isLoading={isLoading}>
          <Card.Heading title="Customer’s details" />
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item
                label="Account ID"
                value={
                  data?.accountId && (
                    <div className="flex text-black">
                      {data?.accountId}
                      <IconButton
                        className="pl-2 p-0"
                        data-testid="risk-profile-navigate-to-account-detail"
                        onClick={() => {
                          router.navigate([`/customers/${data?.accountId}`], {
                            queryParams: {tabIndex: 3},
                            fragment: 'customer-risk-profile-details',
                          });
                        }}>
                        <ExternalIcon className="text-brand-500 w-5 h-5" />
                      </IconButton>
                    </div>
                  )
                }
              />
              <DescList.Item label="Account name" value={data?.accountName} />
              <DescList.Item label="ID number" value={data?.idNumber} />
              <DescList.Item label="Type of ID" value={getTypeOfIdLabel(data?.idType)} />
              <DescList.Item label="Risk score" value={data?.totalScore} />
              <DescList.Item label="Risk rating" value={data?.riskRating} />
              <DescList.Item label="Created on" value={data ? formatDate(data.createdAt) : '-'} />
              <DescList.Item label="Updated on" value={data ? formatDate(data.updatedAt) : '-'} />
              <DescList.Item
                label="Last scored on"
                value={data && data.scoredAt ? formatDate(data.scoredAt) : '-'}
              />
            </DescList>
          </Card.Content>
        </Card>
        <Card>
          <Card.Heading title="Risk scoring">
            <HasPermission accessWith={[adminRiskProfile.adminView]}>
              <Button variant="outline" leftIcon={<EditIcon />} onClick={() => openModal(true)}>
                EDIT
              </Button>
            </HasPermission>
          </Card.Heading>
          <Card.Content>
            <Fieldset legend={'SCORING CATEGORY'} className={'sm:col-span-2'}>
              <DescList isLoading={isLoading} className="pl-14 pt-5 pb-5">
                <DescList.Item label="Customer’s type" value={data?.customerType.description} />
                <DescList.Item
                  label="Customer’s country of residence"
                  value={data?.countryOfResident.description}
                />
                <DescList.Item
                  label="Customer’s nationality"
                  value={mapCustomerNationality(data?.nationality.value)?.label || '-'}
                />
                <DescList.Item label="Watchlist" value={data?.watchList.description} />
                <DescList.Item
                  label="Customer’s nature of business"
                  value={data?.natureOfBusiness.description}
                />
                <DescList.Item label="Wallet size" value={getMoneyFormat(data?.walletLimit)} />
                <DescList.Item label="KYC" value={data?.kyc?.description} />
                <DescList.Item
                  label="Annual transaction"
                  value={getMoneyFormat(data?.annualTransactionAmount)}
                />
              </DescList>
            </Fieldset>
            <hr className="col-span-4" />
            <Fieldset legend={'REASON'} className={'sm:col-span-2'}>
              <DescList isLoading={isLoading} className="pl-14 pt-5">
                <DescList.Item label="Check for" value={mapCheckForReason(data?.checkFor)?.label} />
                <DescList.Item label="Remarks" value={data?.remark || '-'} />
              </DescList>
            </Fieldset>
          </Card.Content>
        </Card>
        <Card>
          <Card.Heading title="History" />
          <Card.Content className="p-0">
            {riskProfileHistories && riskProfileHistories.items.length > 0 && (
              <Table
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={
                  (riskProfileHistories.items.length > 0 || pagination.page > 1) && (
                    <PaginationNavigation
                      onChangePage={pagination.setPage}
                      onChangePageSize={pagination.setPerPage}
                      currentPage={pagination.page}
                      perPage={pagination.perPage}
                      total={riskProfileHistories.total}
                    />
                  )
                }>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="pl-7">ID Number</Table.Th>
                    <Table.Th>Check for</Table.Th>
                    <Table.Th className="pr-7 text-right">Updated On</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {riskProfileHistories.items.map((profile) => (
                    <Table.Tr key={profile.id}>
                      <Table.Td className="pl-7">{profile.idNumber}</Table.Td>
                      <Table.Td>{titleCase(mapCheckForReason(profile.checkFor).label)}</Table.Td>
                      <Table.Td className="pr-7 text-right">
                        {formatDate(profile.updatedAt)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                {riskProfileHistories.isEmpty && (
                  <Table.Caption>
                    <div className="p-6 text-center">
                      <p>No data to be displayed.</p>
                    </div>
                  </Table.Caption>
                )}
              </Table>
            )}
          </Card.Content>
        </Card>
      </div>
      {isRiskProfileModalOpen && (
        <RiskProfileModal
          onClose={() => openModal(false)}
          isUpdate={true}
          riskProfileId={props.id}
        />
      )}
    </PageContainer>
  );
};
