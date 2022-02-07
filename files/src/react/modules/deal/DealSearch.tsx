import {Button, Card, DropdownSelectField, Field, SearchIcon, TextField} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {DealStatus} from './deal.const';

export type DealSearchParams = {
  name: string;
  status?: DealStatus;
};

export type DealSearchProps = {
  search: DealSearchParams;
  isFetching: boolean;
  className?: string;
  onSearch(search: DealSearchParams): void;
};

export const DealSearch: React.VFC<DealSearchProps> = ({
  onSearch,
  search,
  isFetching,
  className,
}) => {
  const formik = useFormik({
    initialValues: search,
    onSubmit: ({status, name}) =>
      onSearch({
        name,
        status: status || null,
      }),
  });

  return (
    <Card className={className}>
      <Card.Content>
        <form className="flex items-center flex-wrap" onSubmit={formik.handleSubmit}>
          <DropdownSelectField
            label="Status"
            {...formik.getFieldProps('status')}
            onChangeValue={(val) => formik.setFieldValue('status', val)}
            placeholder="All"
            options={[
              {label: 'ALL', value: ''},
              ...Object.values(DealStatus).map((status) => ({
                label: status,
                value: status,
              })),
            ]}
          />
          <div className="relative flex-grow mx-4">
            <TextField label="Search" {...formik.getFieldProps('name')} />
            <div className="absolute inset-y-0 right-0 p-2 my-2 mr-1 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <Field>
            <Button isLoading={isFetching} type="submit" variant="primary">
              SEARCH
            </Button>
          </Field>
        </form>
      </Card.Content>
    </Card>
  );
};
