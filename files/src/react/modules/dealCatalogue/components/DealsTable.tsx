import * as RS from '@setel/portal-ui';
import * as React from 'react';
import {useReorder} from 'src/react/hooks/use-reorder';
import {CatalogueDeal} from '../dealCatalogue.type';
import {useCatalogueDetailsFlow} from '../hooks/useCatalogueDetailsFlow';

export type DealsTableProps = Partial<
  Pick<
    ReturnType<typeof useCatalogueDetailsFlow>,
    'deleteDealCandidate' | 'setDeleteDealCandidate' | 'isDeleting'
  >
> & {
  deleteDeal: (id: string) => void;
  dealsPages?: {data: CatalogueDeal[]}[];
  isLoading?: boolean;
  canFetchMore?: boolean;
  isFetchingMore?: boolean;
  fetchMore?: () => void;
  editMode?: boolean;
  openEditForm?: () => void;
  sortable?: ReturnType<typeof useReorder>;
};

export const DealsTable: React.VFC<DealsTableProps> = ({
  dealsPages,
  isLoading,
  isFetchingMore,
  fetchMore,
  canFetchMore,
  openEditForm,
  editMode,
  deleteDeal,
  deleteDealCandidate,
  setDeleteDealCandidate,
  isDeleting,
  sortable,
}) => {
  const cancelRef = React.useRef(null);
  const isEmpty = !isLoading && dealsPages && !dealsPages[0].data.length;
  if (!editMode && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="pb-4">You have not added any deals yet</p>
        <RS.Button onClick={openEditForm} variant="outline" leftIcon={<RS.PlusIcon />}>
          ADD DEALS
        </RS.Button>
      </div>
    );
  }

  return (
    <>
      {!!deleteDealCandidate && (
        <RS.Dialog onDismiss={() => setDeleteDealCandidate(null)} leastDestructiveRef={cancelRef}>
          <RS.DialogContent
            header={`Are you sure want to delete deal '${deleteDealCandidate.name}' from catalogue?`}
          />
          <RS.DialogFooter>
            <RS.Button
              isLoading={isDeleting}
              variant="outline"
              onClick={() => setDeleteDealCandidate(null)}
              ref={cancelRef}>
              CANCEL
            </RS.Button>
            <RS.Button
              isLoading={isDeleting}
              onClick={() => deleteDeal(deleteDealCandidate._id)}
              variant="error">
              DELETE
            </RS.Button>
          </RS.DialogFooter>
        </RS.Dialog>
      )}
      <RS.DataTable
        sortable={sortable?.isSortMode}
        onSortEnd={sortable?.sort}
        isLoading={isLoading}>
        <RS.DataTableRowGroup groupType="thead">
          <RS.DataTableRow>
            {!editMode && <RS.DataTableCell>PRIORITY</RS.DataTableCell>}
            <RS.DataTableCell>DEAL NAME</RS.DataTableCell>
            <RS.DataTableCell>MERCHANT NAME</RS.DataTableCell>
            <RS.DataTableCell>PRICE (POINTS)</RS.DataTableCell>
            <RS.DataTableCell>END DATE</RS.DataTableCell>
            <RS.DataTableCell> </RS.DataTableCell>
          </RS.DataTableRow>
        </RS.DataTableRowGroup>
        {editMode && isEmpty && (
          <RS.DataTableCaption>
            <div className="flex flex-col text-lightgrey items-center justify-center py-8">
              <p>You have not added any deals yet</p>
              <p>Search for a deal in the search bar above to get started</p>
            </div>
          </RS.DataTableCaption>
        )}
        <RS.DataTableRowGroup>
          {dealsPages?.flatMap(({data: deals}, page) =>
            deals?.map(({_id, name, price, endDate, merchant, voucherBatch}, index) => (
              <RS.DataTableRow key={_id}>
                {!editMode && <RS.DataTableCell>{(page + 1) * (index + 1)}</RS.DataTableCell>}
                <RS.DataTableCell>
                  <RS.TextEllipsis widthClass="max-w-xs" text={name} />
                </RS.DataTableCell>
                <RS.DataTableCell>
                  <RS.TextEllipsis
                    widthClass="max-w-xs"
                    text={merchant?.name || voucherBatch?.merchant?.name}
                  />
                </RS.DataTableCell>
                <RS.DataTableCell>{price?.currentPrice || `Free`}</RS.DataTableCell>
                <RS.DataTableCell>
                  {endDate ? RS.formatDate(endDate, {formatType: 'dateOnly'}) : '-'}
                </RS.DataTableCell>

                <RS.DataTableCell>
                  {sortable?.isSortMode ? (
                    <RS.DragHandle />
                  ) : (
                    <RS.IconButton
                      onClick={() =>
                        editMode ? deleteDeal(_id) : setDeleteDealCandidate({_id, page, name})
                      }
                      aria-label="Delete">
                      <RS.TrashIcon className="w-6 h-6 text-red-500" />
                    </RS.IconButton>
                  )}
                </RS.DataTableCell>
              </RS.DataTableRow>
            )),
          )}
        </RS.DataTableRowGroup>
        {canFetchMore && (
          <RS.DataTableCaption>
            <div className="flex justify-center my-6">
              <RS.Button
                isLoading={isFetchingMore}
                variant="outline"
                onClick={() => fetchMore()}
                ref={cancelRef}>
                LOAD MORE
              </RS.Button>
            </div>
          </RS.DataTableCaption>
        )}
      </RS.DataTable>
    </>
  );
};
