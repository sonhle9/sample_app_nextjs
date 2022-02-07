import {
  DataTableRowGroup,
  DataTable as Table,
  DataTableCell,
  DataTableRow as Tr,
  DataTableCellProps,
  CardHeading,
  TextEllipsis,
  Alert,
  SearchableDropdownField,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useRouter} from 'src/react/routing/routing.context';
import {useUserCanUpdateStore} from '../stores.helpers';
import {useStore, useStores} from '../stores.queries';
import {ProductCreate} from './product-create';
import {ProductEdit} from './product-edit';

export interface IProductListProps {
  storeId: string;
}

function Td(props: DataTableCellProps) {
  return (
    <DataTableCell
      {...props}
      className={`align-middle ${props.className ? props.className : ''}`}
    />
  );
}

export function ProductList({storeId}: IProductListProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const {data: stores} = useStores({page: 1, perPage: 10}, {query});

  const {data: currentStore, isLoading, refetch, error} = useStore(storeId);

  const canUpdateStore = useUserCanUpdateStore();

  return (
    <PageContainer>
      {error && (
        <Alert variant="error" description={error?.response?.data?.message} className="mb-4" />
      )}
      <Table
        isLoading={isLoading}
        heading={
          <CardHeading
            title={
              currentStore && (
                <SearchableDropdownField
                  label="Store"
                  value={storeId}
                  initialLabel={currentStore?.name}
                  onChangeValue={(value) => {
                    if (value) {
                      router.navigate(['stores', value, 'items']);
                    }
                  }}
                  onInputValueChange={setQuery}
                  options={stores?.items?.map((store) => ({
                    label: store.name,
                    value: store.storeId,
                  }))}
                />
              )
            }>
            {canUpdateStore && <ProductCreate storeId={storeId} onSuccess={() => refetch()} />}
          </CardHeading>
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Barcode</Td>
            <Td>Image</Td>
            <Td>Name</Td>
            <Td>Availability</Td>
            <Td className="text-right">Price</Td>
            <Td className="text-right">Rank</Td>
            {canUpdateStore && <Td>Action</Td>}
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup>
          {currentStore?.items?.map((item) => (
            <Tr key={item.itemId}>
              <Td>
                <TextEllipsis text={item.barcode} widthClass="w-20" />
              </Td>
              <Td>
                <img className="w-20" src={item.image} alt={item.name}></img>
              </Td>
              <Td>
                <TextEllipsis text={item.name} widthClass="max-w-xs" />
              </Td>
              <Td>{item.isAvailable ? 'Available' : 'Unavailable'}</Td>
              <Td className="text-right">{item.price}</Td>
              <Td className="text-right">{item.rank}</Td>
              {canUpdateStore && (
                <Td>
                  <ProductEdit initialProduct={item} onSuccess={() => refetch()} />
                </Td>
              )}
            </Tr>
          ))}
        </DataTableRowGroup>
      </Table>
    </PageContainer>
  );
}
