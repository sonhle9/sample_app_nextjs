import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextField,
  FieldContainer,
  // TextareaField,
  Button,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {
  useCreateLoyaltyCategory,
  useDeleteCategory,
  useUpdateLoyaltyCategory,
} from '../../point-rules.queries';
import {useRouter} from 'src/react/routing/routing.context';
import {LoyaltyCategory} from '../../point-rules.type';
import {useCanEditLoyaltyCategories} from '../../custom-hooks/use-check-permissions';

export type LoyaltyCategoriesCreateEditModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  initialValues?: Partial<LoyaltyCategory> | null;
};

export type CategoryDeleteModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  closeModal: () => void;
  id?: string;
};

type categoryAction = {type: 'reset'} | {type: 'update'; category: Partial<LoyaltyCategory>};

const categoryReducer = (
  state: Partial<LoyaltyCategory> | null,
  action: categoryAction,
): Partial<LoyaltyCategory> => {
  switch (action.type) {
    case 'reset':
      return null;
    case 'update':
      return {
        ...state,
        ...action.category,
      };
    default:
      return state;
  }
};

export const CategoryDeleteModal: React.VFC<CategoryDeleteModalProps> = ({
  isOpen,
  onDismiss,
  closeModal,
  id,
}) => {
  const router = useRouter();
  const {mutateAsync: mutateDeleteCategory, isLoading, isError, error} = useDeleteCategory();

  const handleDeleteCategory = async () => {
    const res = await mutateDeleteCategory(id);
    if (res) {
      onDismiss();
    }
    router.navigateByUrl(`/loyalty/loyalty-categories`);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} aria-label="Delete Category">
      <ModalHeader>Are you sure to delete this category?</ModalHeader>
      <ModalBody data-testid="delete-modal-body">
        {isError && (
          <div className="pb-4">
            <QueryErrorAlert
              error={(error as any) || null}
              description="Error while deleting category"
            />
          </div>
        )}
        This action cannot be undone and you will not be able to recover any data.
      </ModalBody>
      <ModalFooter className="text-right">
        <Button variant="outline" className="rounded mr-5" onClick={closeModal}>
          CANCEL
        </Button>
        <Button variant="error" onClick={handleDeleteCategory} isLoading={isLoading}>
          DELETE
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export const LoyaltyCategoriesCreateEditModal: React.VFC<LoyaltyCategoriesCreateEditModalProps> = ({
  isOpen,
  onDismiss,
  initialValues,
}) => {
  const router = useRouter();
  const canEditLoyaltyCategories = useCanEditLoyaltyCategories();
  const [categoryState, dispatchCategory] = React.useReducer(categoryReducer, null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const {
    mutateAsync: mutateCreateCategory,
    isLoading: createLoading,
    isError: createIsError,
    error: createError,
  } = useCreateLoyaltyCategory();
  const {
    mutateAsync: mutateUpdateCategory,
    isLoading: updateLoading,
    isError: updateIsError,
    error: updateError,
  } = useUpdateLoyaltyCategory();

  React.useEffect(() => {
    dispatchCategory({type: 'update', category: {...initialValues}});
  }, [isOpen, initialValues]);

  const handleCategoryUpdates = (e: any) => {
    dispatchCategory({type: 'update', category: {[e.target.name]: e.target.value}});
  };

  const handleDismiss = () => {
    dispatchCategory({type: 'reset'});
    setShowDeleteModal(false);
    onDismiss();
  };

  const handleCreateUpdateCategory = async () => {
    const res = initialValues
      ? await mutateUpdateCategory(categoryState as LoyaltyCategory)
      : await mutateCreateCategory(categoryState as LoyaltyCategory);

    if (res && initialValues?.categoryCode === categoryState?.categoryCode) {
      handleDismiss();
    } else if (res) {
      handleDismiss();
      router.navigateByUrl(`/loyalty/loyalty-categories`);
    }
  };

  return (
    <>
      <CategoryDeleteModal
        isOpen={showDeleteModal}
        onDismiss={handleDismiss}
        closeModal={() => setShowDeleteModal(false)}
        id={initialValues?.id}
      />
      <Modal isOpen={isOpen} onDismiss={handleDismiss} aria-label="Create Edit Category">
        <ModalHeader>{initialValues ? 'Edit category' : 'Create category'}</ModalHeader>
        <ModalBody data-testid="create-update-fields">
          {(createIsError || updateIsError) && (
            <div className="pb-4 col-span-3">
              <QueryErrorAlert
                error={(createError as any) || (updateError as any) || null}
                description="Error while creating category"
              />
            </div>
          )}
          <FieldContainer
            label={<span className="text-base">Category name</span>}
            layout="horizontal-responsive"
            labelAlign="start">
            <TextField
              placeholder="Insert your category name"
              value={categoryState?.categoryName}
              type="text"
              className="w-full sm:w-72 -mb-5"
              name="categoryName"
              onChange={(e) => handleCategoryUpdates(e)}
            />
          </FieldContainer>
          <FieldContainer
            label={<span className="text-base">Code</span>}
            layout="horizontal-responsive"
            labelAlign="start">
            <TextField
              placeholder="Insert your category code"
              value={categoryState?.categoryCode}
              type="text"
              className="w-full sm:w-72 -mb-5"
              name="categoryCode"
              onChange={(e) => handleCategoryUpdates(e)}
            />
          </FieldContainer>
          <FieldContainer
            label={<span className="text-base">Description</span>}
            layout="horizontal-responsive"
            labelAlign="start">
            <TextField
              placeholder="Insert your category description"
              value={categoryState?.categoryDescription}
              type="text"
              className="w-full sm:w-72 -mb-5"
              name="categoryDescription"
              onChange={(e) => handleCategoryUpdates(e)}
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="flex">
            {initialValues ? (
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="bg-gray-50 hover:bg-gray-50 shadow-none border-none"
                data-testid="delete-button"
                disabled={!canEditLoyaltyCategories}>
                <span className="text-red-500">DELETE</span>
              </Button>
            ) : null}
            <div className="flex flex-grow justify-end">
              <Button
                variant="outline"
                className="mr-5"
                data-testid="cancel-button"
                onClick={handleDismiss}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateUpdateCategory}
                data-testid="save-button"
                isLoading={createLoading || updateLoading}
                disabled={!canEditLoyaltyCategories}>
                {initialValues ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
