import * as React from 'react';
import {
  Card,
  CardContent,
  DropdownSelect,
  SearchTextInput,
  FieldContainer,
  titleCase,
  Filter,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  Badge,
  useFilter,
  Button,
  PlusIcon,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import {LoyaltyCategoriesCreateEditModal} from './loyalty-categories-create-edit-modal';
import {CategoryType, LoyaltyCategory as LoyaltyCategoriesType} from '../../point-rules.type';
import {useGetLoyaltyCategories} from '../../point-rules.queries';
import {useCanEditLoyaltyCategories} from '../../custom-hooks/use-check-permissions';
import {PageContainer} from 'src/react/components/page-container';

export const LoyaltyCategories = () => {
  const [{values, applied}, {setValueCurry, setValue, reset}] = useFilter({
    categoryType: CategoryType.CATEGORY_NAME as string,
    search: '',
  });

  const canEditLoyaltyCategories = useCanEditLoyaltyCategories();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const {
    data: allCategories,
    isLoading: allCategoriesLoading,
    isError: allCategoriesError,
  } = useGetLoyaltyCategories({[values.categoryType]: values.search});

  const filters = React.useMemo(() => {
    return applied?.filter((apl) => apl.prop !== 'categoryType');
  }, [applied]);

  const onReset = () => {
    reset();
  };

  const setSearchValue = (val: string) => {
    setValue('search', val);
  };

  return (
    <>
      <LoyaltyCategoriesCreateEditModal isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      <PageContainer
        heading="Categories"
        action={
          canEditLoyaltyCategories && (
            <Button
              variant="primary"
              className="h-11"
              data-testid="create-button"
              leftIcon={<PlusIcon />}
              onClick={() => setIsOpen(true)}>
              CREATE
            </Button>
          )
        }>
        <Card>
          <CardContent className="grid grid-cols-2 gap-4" data-testid="search-card">
            <FieldContainer label="Category type">
              <DropdownSelect
                value={values.categoryType}
                data-testid="id-type"
                onChangeValue={setValueCurry('categoryType')}
                options={Object.entries(CategoryType).map(([key, value]) => {
                  return {
                    value,
                    label: titleCase(key, {hasUnderscore: true}),
                  };
                })}
              />
            </FieldContainer>
            <FieldContainer label="Search">
              <SearchTextInput
                value={values.search}
                placeholder="Search here..."
                onChangeValue={(val) => setSearchValue(val)}
                data-testid="search-input"
              />
            </FieldContainer>
          </CardContent>
        </Card>

        {filters.length > 0 && (
          <Filter className="pt-8" onReset={onReset}>
            {filters.map((item) => (
              <Badge onDismiss={item.resetValue} key={item.prop}>
                {item.label}
              </Badge>
            ))}
          </Filter>
        )}

        <div className="mt-8">
          <DataTable isLoading={allCategoriesLoading} skeletonRowNum={3} striped>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>Category name</Td>
                <Td>Code</Td>
              </Tr>
            </DataTableRowGroup>

            {allCategoriesError ? (
              <DataTableCaption
                className="text-center py-12 text-mediumgrey text-md"
                data-testid="no-categories">
                <p>No records found</p>
                <p>Try again with a different information type</p>
              </DataTableCaption>
            ) : (
              <DataTableRowGroup>
                {allCategories?.length > 0 &&
                  (allCategories || []).map((category: LoyaltyCategoriesType) => (
                    <Tr
                      render={(props) => (
                        <Link
                          {...props}
                          to={`/loyalty/loyalty-categories/${category.categoryCode}`}
                          data-testid="categories"
                        />
                      )}
                      key={category.id}>
                      <Td>{category.categoryName}</Td>
                      <Td>{category.categoryCode}</Td>
                    </Tr>
                  ))}
              </DataTableRowGroup>
            )}
          </DataTable>
        </div>
      </PageContainer>
    </>
  );
};
