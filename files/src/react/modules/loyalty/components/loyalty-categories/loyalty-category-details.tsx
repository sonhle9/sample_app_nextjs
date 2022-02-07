import * as React from 'react';
import {Card, CardContent, CardHeading, Button, EditIcon, FieldContainer} from '@setel/portal-ui';
import {useGetLoyaltyCategoryByCode} from '../../point-rules.queries';
import {LoyaltyCategoriesCreateEditModal} from './loyalty-categories-create-edit-modal';
import {useCanEditLoyaltyCategories} from '../../custom-hooks/use-check-permissions';
import {PageContainer} from 'src/react/components/page-container';

export type LoyaltyCategoryDetailsProps = {
  code: string;
};

export const LoyaltyCategoryDetails: React.VFC<LoyaltyCategoryDetailsProps> = ({code}) => {
  const {data} = useGetLoyaltyCategoryByCode(code);
  const canEditLoyaltyCategories = useCanEditLoyaltyCategories();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <LoyaltyCategoriesCreateEditModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        initialValues={data}
      />
      <PageContainer heading="Category details">
        <Card data-testid="category-details-container">
          <CardHeading title="General">
            {canEditLoyaltyCategories && (
              <Button
                variant="outline"
                className="rounded mr-5"
                data-testid="edit-button"
                leftIcon={<EditIcon />}
                onClick={() => setIsOpen(true)}>
                EDIT
              </Button>
            )}
          </CardHeading>
          <CardContent>
            <FieldContainer
              label={<span className="text-base">Category name</span>}
              layout="horizontal-responsive"
              labelAlign="start">
              <div className="pt-2.5">{data?.categoryName || '-'}</div>
            </FieldContainer>
            <FieldContainer
              label={<span className="text-base">Code</span>}
              layout="horizontal-responsive"
              labelAlign="start">
              <div className="pt-2.5">{data?.categoryCode || '-'}</div>
            </FieldContainer>
            <FieldContainer
              label={<span className="text-base">Description</span>}
              layout="horizontal-responsive"
              labelAlign="start">
              <div className="pt-2.5">{data?.categoryDescription || '-'}</div>
            </FieldContainer>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};
