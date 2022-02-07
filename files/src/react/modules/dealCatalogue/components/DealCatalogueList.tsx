import * as RS from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {isDomainError} from 'src/react/errors';
import {getDefaultPageSize} from 'src/react/lib/utils';
import {Link} from 'src/react/routing/link';
import {DealCatalogueVariant} from '../dealCatalogue.type';
import {useCataloguesWithDealsNumber} from '../hooks/useCatalogueWithDealsNumber';
import {DetailsForm} from './DetailsForm';

export const DealCatalogueList: React.VFC = () => {
  const {catalogues, sortable, isCreateVisible, setIsCreateVisible, createCatalogue} =
    useCataloguesWithDealsNumber();
  const defaultPageSize = getDefaultPageSize();
  return (
    <PageContainer
      heading="Deal catalogues"
      action={
        <div className="flex">
          {sortable.isSortMode ? (
            <>
              <RS.Button
                isLoading={sortable.isLoading}
                className="mr-4"
                variant="primary"
                onClick={() => sortable.mutate()}>
                SAVE CHANGES
              </RS.Button>
              <RS.Button
                isLoading={sortable.isLoading}
                variant="outline"
                onClick={() => sortable.disableSortMode({cancel: true})}>
                CANCEL
              </RS.Button>
            </>
          ) : (
            <>
              <RS.Button
                className="mr-4"
                variant="outline"
                leftIcon={<RS.OrderIcon />}
                onClick={sortable.enableSortMode}>
                RE-ORDER
              </RS.Button>
              <RS.Button
                onClick={() => setIsCreateVisible(true)}
                variant="primary"
                leftIcon={<RS.PlusIcon />}>
                CREATE
              </RS.Button>
            </>
          )}
        </div>
      }>
      <RS.Notification
        isShow={sortable.isError && isDomainError(sortable.error)}
        variant="error"
        description={sortable.error?.data.message}
      />
      {isCreateVisible && (
        <DetailsForm onDismiss={() => setIsCreateVisible(false)} onSubmit={createCatalogue} />
      )}
      <RS.DataTable
        sortable={sortable.isSortMode}
        onSortEnd={sortable.sort}
        isLoading={catalogues.isFetching}>
        <RS.DataTableRowGroup groupType="thead">
          <RS.DataTableRow>
            <RS.DataTableCell>DISPLAY ORDER</RS.DataTableCell>
            <RS.DataTableCell>CATALOGUE NAME</RS.DataTableCell>
            <RS.DataTableCell>SHOWS IN MAIN PAGE</RS.DataTableCell>
            <RS.DataTableCell>ACTIVE DEALS</RS.DataTableCell>
            {sortable.isSortMode && <RS.DataTableCell> </RS.DataTableCell>}
          </RS.DataTableRow>
        </RS.DataTableRowGroup>
        <RS.DataTableRowGroup data-testid="catalogue-list">
          {catalogues.data?.pages.flatMap(({data}, page) =>
            data.map(({_id, title, variant, activeDealsCount}, index) => (
              <RS.DataTableRow key={_id}>
                <RS.DataTableCell>{index + 1 + page * defaultPageSize}</RS.DataTableCell>
                <RS.DataTableCell>
                  <Link to={`/deals/deal-catalogues/${_id}`}>
                    <RS.TextEllipsis widthClass="max-w-xs" text={title} />
                  </Link>
                </RS.DataTableCell>
                <RS.DataTableCell>
                  {variant === DealCatalogueVariant.HIGHLIGHTED ? 'Yes' : 'No'}
                </RS.DataTableCell>
                <RS.DataTableCell>{activeDealsCount?.toLocaleString() || '-'}</RS.DataTableCell>
                {sortable.isSortMode && (
                  <RS.DataTableCell>
                    <RS.DragHandle />
                  </RS.DataTableCell>
                )}
              </RS.DataTableRow>
            )),
          )}
        </RS.DataTableRowGroup>
        {catalogues.hasNextPage && (
          <RS.DataTableCaption>
            <div className="flex justify-center my-6">
              <RS.Button
                isLoading={Boolean(catalogues.isFetchingNextPage)}
                variant="outline"
                onClick={() => catalogues.fetchNextPage()}>
                LOAD MORE
              </RS.Button>
            </div>
          </RS.DataTableCaption>
        )}
      </RS.DataTable>
    </PageContainer>
  );
};
