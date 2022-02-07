import * as RS from '@setel/portal-ui';
import * as React from 'react';
import {InfoLine} from 'src/react/components/info-line';
import {Locale, LocaleName} from 'src/react/shared/i18n';
import {DealCatalogueStatus, DealCatalogueVariant} from '../dealCatalogue.type';
import {useCatalogueDetailsFlow} from '../hooks/useCatalogueDetailsFlow';
import {DealsForm} from './DealsForm';
import {DealsTable} from './DealsTable';
import {DetailsForm} from './DetailsForm';

export type DealCatalogueDetailsProps = {
  catalogueId: string;
};

const STATUS_COLORS: Record<DealCatalogueStatus, RS.BadgeProps['color']> = {
  [DealCatalogueStatus.DRAFT]: 'grey',
  [DealCatalogueStatus.PUBLISHED]: 'success',
};

export const DealCatalogueDetails: React.VFC<DealCatalogueDetailsProps> = ({catalogueId}) => {
  const {
    deals,
    showModal,
    toggleShowModal,
    catalogue,
    updateCatalogue,
    deleteCatalogue,
    isReadyForPublish,
    isPublished,
    deleteDeal,
    deleteDealCandidate,
    setDeleteDealCandidate,
    isDeleting,
    sortable,
  } = useCatalogueDetailsFlow(catalogueId);

  if (catalogue.isLoading) {
    return null;
  }

  return (
    <div className="container max-w-6xl px-24 py-8 m-auto">
      {showModal.details && (
        <DetailsForm
          payload={catalogue.data}
          editMode
          onDismiss={() => toggleShowModal('details')}
          onSubmit={updateCatalogue.mutateAsync}
          onDelete={() => deleteCatalogue.mutate()}
          isDeleting={deleteCatalogue.isLoading}
          showDeleteDialog={showModal.confirmDeleteCatalogue}
          setShowDeleteDialog={() => toggleShowModal('confirmDeleteCatalogue')}
        />
      )}
      {showModal.deals && (
        <DealsForm catalogueId={catalogueId} onDismiss={() => toggleShowModal('deals')} />
      )}
      <div className="flex justify-between items-center">
        <RS.Text className={RS.classes.h1}>{catalogue.data.title[Locale.ENGLISH]}</RS.Text>
        <RS.Button
          onClick={() =>
            updateCatalogue.mutate({
              status: isPublished ? DealCatalogueStatus.DRAFT : DealCatalogueStatus.PUBLISHED,
            })
          }
          disabled={!isReadyForPublish}
          variant={isPublished ? 'error' : 'primary'}>
          {isPublished ? 'UNPUBLISH' : 'PUBLISH'}
        </RS.Button>
      </div>

      <RS.Card className="mt-6 p-6">
        {!isPublished && (
          <RS.Alert
            className="my-3"
            variant={isReadyForPublish ? 'info' : 'warning'}
            description={
              isReadyForPublish
                ? 'Your category ready to publish, please click “Publish” button'
                : 'You need to complete all the information before publish'
            }
          />
        )}
        <InfoLine label="Status">
          <RS.Badge
            className="tracking-wider font-semibold"
            rounded="rounded"
            color={STATUS_COLORS[catalogue.data.status]}>
            {catalogue.data.status}
          </RS.Badge>
        </InfoLine>
        <InfoLine label="Created on">
          {RS.formatDate(catalogue.data.createdAt, {formatType: 'dateAndTime'})}
        </InfoLine>
      </RS.Card>

      <RS.Card className="mt-6">
        <RS.Tabs>
          <RS.CardHeading title="Details">
            <RS.Button variant="outline" minWidth="none" onClick={() => toggleShowModal('details')}>
              <RS.EditIcon className="w-4 h-4 mr-2" />
              EDIT
            </RS.Button>
          </RS.CardHeading>
          <RS.Tabs.TabList>
            {Object.values(Locale).map((locale) => (
              <RS.Tabs.Tab label={LocaleName[locale]} key={locale} />
            ))}
          </RS.Tabs.TabList>
          <RS.CardContent>
            <RS.Tabs.Panels>
              {Object.values(Locale).map((locale) => (
                <RS.Tabs.Panel key={locale}>
                  <InfoLine label="Name">{catalogue.data.title[locale] || '-'}</InfoLine>
                </RS.Tabs.Panel>
              ))}
            </RS.Tabs.Panels>

            <InfoLine label="Catalogue icon">
              <img src={catalogue.data.icon.url} />
            </InfoLine>
            <InfoLine label="Display on main page">
              {catalogue.data.variant === DealCatalogueVariant.HIGHLIGHTED ? 'Yes' : 'No'}
            </InfoLine>
          </RS.CardContent>
        </RS.Tabs>
      </RS.Card>

      <RS.Card className="mt-6">
        <RS.CardHeading title="Deals">
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
            <div className="flex">
              <RS.Button
                className="mr-4"
                variant="outline"
                leftIcon={<RS.OrderIcon />}
                onClick={sortable.enableSortMode}>
                RE-ORDER
              </RS.Button>
              <RS.Button
                variant="outline"
                minWidth="none"
                onClick={() => toggleShowModal('deals')}
                leftIcon={<RS.PlusIcon />}>
                ADD DEALS
              </RS.Button>
            </div>
          )}
        </RS.CardHeading>
        <DealsTable
          sortable={sortable}
          isLoading={deals.isLoading}
          fetchMore={deals.fetchNextPage}
          canFetchMore={deals.hasNextPage}
          isFetchingMore={deals.isFetchingNextPage}
          dealsPages={deals.data?.pages}
          deleteDeal={deleteDeal}
          deleteDealCandidate={deleteDealCandidate}
          isDeleting={isDeleting}
          setDeleteDealCandidate={setDeleteDealCandidate}
          openEditForm={() => toggleShowModal('deals')}
        />
      </RS.Card>
    </div>
  );
};
