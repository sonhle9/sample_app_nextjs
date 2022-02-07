import * as React from 'react';
import {DataTable as Table, formatMoney, BareButton} from '@setel/portal-ui';
import {EmptyContent} from 'src/react/components/empty-content';
import {FeePlansPaymentMethod} from '../../fee-plans.type';
import {
  mappingPaymentMethodTypes,
  mappingPaymentMethodLogos,
  mappingPaymentMethodBrands,
} from '../../fee-plans.constant';
import {buildFeePlanRate} from '../../fee-plans.helper';

interface FeePlanPaymentMethodProps {
  paymentMethodsByGroup: FeePlansPaymentMethod[];
  setShowModal: Function;
  setSelectedPaymentMethod: Function;
  stripedColor?: string;
}

export const FeePlansPaymentMethodsRows = ({
  paymentMethodsByGroup,
  setShowModal,
  setSelectedPaymentMethod,
  stripedColor,
}: FeePlanPaymentMethodProps) => {
  const [firstRow, ...restRows] = paymentMethodsByGroup;

  return (
    <>
      <Table.Tr key={firstRow.id} className={stripedColor}>
        <Table.Td className="-mt-1 -mb-1 pl-7 align-middle">
          {mappingPaymentMethodTypes[firstRow.type]}
        </Table.Td>
        <Table.Td>
          <div className="-mt-1 -mb-1 flex content-center space-x-1">
            <img src={mappingPaymentMethodLogos[firstRow.brand]} />
            <div className="p-1">{mappingPaymentMethodBrands[firstRow.brand]}</div>
          </div>
        </Table.Td>
        <Table.Td className="-mt-1 -mb-1 text-right align-middle">
          <EmptyContent
            content={firstRow.rate}
            contentDisplay={buildFeePlanRate(firstRow.rateType, formatMoney(firstRow.rate))}
          />
        </Table.Td>
        <Table.Td className="-mt-1 -mb-1 text-right align-middle">
          <EmptyContent content={firstRow.minimum} contentDisplay={formatMoney(firstRow.minimum)} />
        </Table.Td>
        <Table.Td className="-mt-1 -mb-1 text-right align-middle">
          <EmptyContent content={firstRow.maximum} contentDisplay={formatMoney(firstRow.maximum)} />
        </Table.Td>
        <Table.Td className="-mt-1 -mb-1 text-right pr-7 align-middle">
          <BareButton
            className="text-brand-500 cursor-pointer"
            onClick={() => {
              setShowModal(true);
              setSelectedPaymentMethod(firstRow);
            }}>
            EDIT
          </BareButton>
        </Table.Td>
      </Table.Tr>
      {restRows.map((paymentMethod: FeePlansPaymentMethod) => (
        <Table.Tr key={paymentMethod.id} className={stripedColor}>
          <Table.Td className="-mt-1 -mb-1 pl-7 align-middle"></Table.Td>
          <Table.Td>
            <div className="-mt-1 -mb-1 flex content-center space-x-1">
              <img src={mappingPaymentMethodLogos[paymentMethod.brand]} />
              <div className="p-1">{mappingPaymentMethodBrands[paymentMethod.brand]}</div>
            </div>
          </Table.Td>
          <Table.Td className="-mt-1 -mb-1 text-right align-middle">
            <EmptyContent
              content={paymentMethod.rate}
              contentDisplay={buildFeePlanRate(
                paymentMethod.rateType,
                formatMoney(paymentMethod.rate),
              )}
            />
          </Table.Td>
          <Table.Td className="-mt-1 -mb-1 text-right align-middle">
            <EmptyContent
              content={paymentMethod.minimum}
              contentDisplay={formatMoney(paymentMethod.minimum)}
            />
          </Table.Td>
          <Table.Td className="-mt-1 -mb-1 text-right align-middle">
            <EmptyContent
              content={paymentMethod.maximum}
              contentDisplay={formatMoney(paymentMethod.maximum)}
            />
          </Table.Td>
          <Table.Td className="-mt-1 -mb-1 text-right pr-7 align-middle">
            <BareButton
              className="text-brand-500 cursor-pointer"
              onClick={() => {
                setShowModal(true);
                setSelectedPaymentMethod(paymentMethod);
              }}>
              EDIT
            </BareButton>
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  );
};
