import {
  Card,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Pagination,
  Section,
  SectionHeading,
  usePaginationState,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  convertAnyToString,
  convertUnixTimestampToString,
  convertUnderscoreToWhitespace,
} from '../../customers.helper';
import {useCustomerAttributes} from '../../customers.queries';

export function CustomerDataPlatform({userId}: {userId: string}) {
  return (
    <Section>
      <SectionHeading className="mb-4" title="Customer Data Platform" />
      <CustomerDataPlatformAttributes userId={userId} />
    </Section>
  );
}

export function CustomerDataPlatformAttributes({userId}: {userId: string}) {
  const [open, setOpen] = React.useState(false);
  const [attributes, setAttributes] = React.useState([]);
  const {data: entity, isLoading} = useCustomerAttributes(userId, {
    enabled: open,
    onSuccess: (data) => {
      setAttributes(Object.keys(data.attributes).sort((a, b) => (a >= b ? 1 : -1)));
    },
  });

  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const totalPage = Math.ceil(attributes.length / perPage);

  return (
    <div className="mb-10">
      <Table
        striped={false}
        heading={<Card.Heading title="Attributes" data-testid="customer-attributes-card-header" />}
        expandable
        isLoading={isLoading}
        isOpen={open}
        onToggleOpen={() => setOpen((prev) => !prev)}
        pagination={
          <Pagination
            currentPage={page}
            lastPage={totalPage}
            pageSize={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
            onGoToLast={() => setPage(totalPage)}
            variant="prev-next"
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td data-testid="customer-attributes-table-attribute-col">Attribute</Td>
            <Td>Value</Td>
            <Td className="text-right">Last updated</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup groupType="tbody">
          {attributes.length > 0 &&
            attributes.slice((page - 1) * perPage, page * perPage).map((attribute) => (
              <Tr key={attribute}>
                <Td>
                  {titleCase(convertUnderscoreToWhitespace(entity.attributes[attribute].key))}
                </Td>
                <Td>
                  {convertAnyToString(entity.attributes[attribute].value)
                    ? convertAnyToString(entity.attributes[attribute].value)
                    : '-'}
                </Td>
                <Td className="text-right">
                  {entity.attributes[attribute].updatedAt
                    ? convertUnixTimestampToString(entity.attributes[attribute].updatedAt)
                    : '-'}
                </Td>
              </Tr>
            ))}
        </DataTableRowGroup>
      </Table>
    </div>
  );
}
