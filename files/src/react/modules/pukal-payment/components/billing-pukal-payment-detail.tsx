import {
  classes,
  Card,
  DescList,
  DescItem,
  Badge,
  titleCase,
  PaginationNavigation,
  Text,
} from '@setel/portal-ui';
import * as React from 'react';
import {SubtypeMap} from 'src/shared/enums/card.enum';
import {ColorMap, Reason} from 'src/app/cards/shared/enums';
import {HasPermission} from '../../auth/HasPermission';
import {cardRole} from 'src/shared/helpers/roles.type';
import {
  DataTable as Table,
  DataTableRowGroup as Row,
  DataTableRow as Tr,
  DataTableCell as Td,
} from '@setel/portal-ui';

interface ICardDetailsProps {
  id: string;
}

export const BillingPukalPaymentDetails = (props: ICardDetailsProps) => {
  let card: any = undefined;
  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <HasPermission accessWith={[cardRole.read]}>
          <>
            <div className="justify-between mt-3">
              <h1 className={classes.h1}>Pukal payment details - {props.id}</h1>
            </div>
            <Card className="mb-6">
              <Card.Heading title={<span className="text-xl">General</span>}></Card.Heading>
              <Card.Content className="p-7">
                <div>
                  <DescList className="col-span-5">
                    <DescItem
                      label="Pukal payment ID"
                      labelClassName="text-sm"
                      value={
                        card?.status && (
                          <Badge
                            className="tracking-wider font-semibold uppercase"
                            rounded="rounded"
                            color={ColorMap[card.status]}
                            style={{width: 'fit-content'}}>
                            {card.status}
                          </Badge>
                        )
                      }
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Status"
                      value={
                        (card?.reason &&
                          (Object.values(Reason).includes(card?.reason as Reason)
                            ? titleCase(card?.reason)
                            : Reason.Others)) ||
                        '-'
                      }
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Pukal type"
                      value={card?.remark || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="Pukal code"
                      value={card?.type || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="Transaction date"
                      value={card?.formFactor || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal capitalize"
                      label="GL settlement"
                      value={card?.physicalType || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Transaction code"
                      value={
                        card?.subtype
                          ? SubtypeMap.find((subtype) => subtype.value === card.subtype)?.label
                          : '-'
                      }
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Slip number"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Issuing bank"
                      value={card?.merchant?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Cheque amount"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Cheque number"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Created on"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Created by"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Approved on"
                      value={card?.cardGroup?.name || '-'}
                    />
                    <DescItem
                      labelClassName="text-sm"
                      valueClassName="text-sm font-normal"
                      label="Approved by"
                      value={card?.cardGroup?.name || '-'}
                    />
                  </DescList>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Heading title={<span className="text-xl">Pukal accounts</span>}></Card.Heading>
              <Card.Content>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        total amount
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        cheque amount
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                  <div>
                    <span>
                      <Text
                        color="lightgrey"
                        className="uppercase font-semibold tracking-widest text-xs w-44 leading-relaxed">
                        difference
                      </Text>
                    </span>
                    <span className="text-xl font-medium">RM 50,000.00</span>
                  </div>
                </div>
              </Card.Content>
              <Table
                striped
                pagination={
                  <PaginationNavigation
                    total={0}
                    currentPage={0}
                    perPage={0}
                    onChangePage={() => {}}
                    onChangePageSize={() => {}}
                  />
                }>
                <Row groupType="thead">
                  <Tr>
                    <Td className="w-2/12 pl-7">SmartPay account number</Td>
                    <Td className="w-2/12">SmartPay account name</Td>
                    <Td className="w-2/12 text-right">sales amount (RM)</Td>
                    <Td className="w-3/12 text-right">pukal sedut (RM)</Td>
                    <Td className="w-3/12 text-right pr-7">payment amount (RM)</Td>
                  </Tr>
                </Row>
                <Row></Row>
              </Table>
            </Card>
          </>
        </HasPermission>
      </div>
    </>
  );
};
