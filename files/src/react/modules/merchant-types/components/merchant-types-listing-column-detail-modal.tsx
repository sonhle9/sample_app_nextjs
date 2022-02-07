import {IListingColumn, IMerchantType} from '../merchant-types.type';
import * as React from 'react';
import {
  Button,
  DropdownSelectField,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import {useMerchantFields, useSetMerchantType} from '../merchant-types.queries';
import {useRouter} from '../../../routing/routing.context';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {MERCHANT_TYPES_UPDATED_STORAGE_KEY} from '../merchant-types.service';

interface IMerchantTypesDetailModal {
  merchantType: IMerchantType;
  onClose?: () => void;
}

export const MerchantTypeListingColumnsDetailModal = (props: IMerchantTypesDetailModal) => {
  const {merchantType} = props;
  const router = useRouter();
  const {mutate: setMerchantType, error: submitError} = useSetMerchantType(props.merchantType);
  const {data: merchantFields, error: loadMerchantFieldsError} = useMerchantFields();

  const error = loadMerchantFieldsError || submitError;

  const [columns, setColumns] = React.useState<IListingColumn[]>(
    merchantType.listingConfigurations || [],
  );

  const [allColumns, setAllColumns] = React.useState(columns);

  React.useEffect(() => {
    if (merchantFields) {
      const allFields = merchantFields.merchantFields.map((c) => ({
        label: c.label,
        name: c.name,
      }));
      setAllColumns(allFields);
    }
  }, [merchantFields]);

  const onUpdateMerchantType = async () => {
    setMerchantType(
      {
        ...merchantType,
        listingConfigurations: columns,
      },
      {
        onSuccess: (res) => {
          props.onClose();
          localStorage.setItem(MERCHANT_TYPES_UPDATED_STORAGE_KEY, 'Y');
          dispatchEvent(new Event('storage'));
          if (res && res.id) {
            router.navigateByUrl(`/merchant-types/${res.id}`);
          }
        },
      },
    );
  };

  const updateColumn = (label: string, value: string, index: number) => {
    const cloneColumns = [...columns];
    cloneColumns.splice(index, 1, {
      name: value,
      label,
    });
    setColumns(cloneColumns);
  };

  const getOptions = (fieldName: string) => {
    const options = allColumns.filter((c) => {
      return c.name === fieldName || !columns.find((c1) => c1.name === c.name);
    });
    return options.map((option) => ({
      label: option.label,
      value: option.name,
    }));
  };

  const getFieldLabel = (index: number) => {
    return `Column ${index}`;
  };

  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label="Edit merchant listing columns">
        <ModalHeader>Edit merchant listing columns</ModalHeader>
        <form>
          <ModalBody>
            {error && <QueryErrorAlert error={error as any} />}
            {columns.map((column, index) => (
              <DropdownSelectField
                key={index}
                layout={'horizontal-responsive'}
                disabled={!index}
                label={getFieldLabel(index + 1)}
                value={column.name}
                onChangeValue={(newValue, label) => {
                  updateColumn(label, newValue, index);
                }}
                options={getOptions(column.name)}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              <div />
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onClose}>
                  CANCEL
                </Button>
                <div style={{width: 12}} />
                <Button onClick={onUpdateMerchantType} variant="primary">
                  SAVE
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
