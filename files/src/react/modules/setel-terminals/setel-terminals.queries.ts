import {useMutation, useQuery, useQueryClient} from 'react-query';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {
  addHostTerminalReg,
  editHostTerminalReg,
  getTerminalDetails,
  importTerminalSerialNumbers,
  updateTerminal,
  getTerminals,
  getTerminalTerminalIds,
  deleteHostTerminalReg,
  uploadCSV,
  downloadTerminalReports,
  deactivateTerminal,
  getTerminalInventory,
  updateTerminalInventory,
} from 'src/react/services/api-terminal.service';
import {checkPendingSettlements} from '../terminal-switch-transactions/terminal-switch-transaction.service';
import {
  ITerminalGetPendingSettlementReq,
  ITerminalTerminalIdFilterRequest,
} from 'src/react/services/api-terminal.type';
import {CardBrandPrettyTextMapping, TerminalStatus} from './setel-terminals.const';
import {getMerchantPaymentMethods} from 'src/react/services/api-payment-acceptance.service';
import {SetelTerminalCardType} from './setel-terminals.types';
import {GET_SETEL_TERMINAL_CARD_TYPE} from './setel-terminals.helper';

export const SETEL_TERMINAL_QUERY_KEY = {
  TERMINAL_DETAIL: 'setel-terminal-details',
  TERMINALS_LISTING: 'setel-terminal-listing',
  TERMINALS_INVENTORY_LISTING: 'setel-terminal-inventory-listing',
  CHECK_PENDING_SETTLEMENT: 'setel-terminal-check-pending-settlement',
  SERIAL_NUMBERS: 'setel-terminal-serial-numbers',
  SERIAL_NUMBERS_INVENTORY: 'setel-terminal-serial-numbers-in-inventory',
  TERMINAL_IDS: 'setel-terminal-terminalIds',
  PAYMENT_ACCEPTANCE: 'setel-terminal-payment-acceptance',
};

export const useTerminalsDetails = (serialNum: string) =>
  useQuery([SETEL_TERMINAL_QUERY_KEY.TERMINAL_DETAIL, serialNum], () =>
    getTerminalDetails(serialNum),
  );

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery(['merchants', filter], () => searchMerchantsWithNameOrID(filter), {
    keepPreviousData: true,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        metadata: merchant.merchantId,
      })),
  });
};

export const useGetSerialNumbers = (serialNum?: string) => {
  return useQuery(
    [SETEL_TERMINAL_QUERY_KEY.SERIAL_NUMBERS, serialNum],
    () => getTerminals({serialNum}),
    {
      keepPreviousData: true,
      select: (result) =>
        result.terminals.map((value) => ({
          value: value.serialNum,
          label: value.serialNum,
          metadata: value.serialNum,
        })),
    },
  );
};

export const useGetInventorySerialNumbers = ({
  serialNum,
  excludeCreatedStatus = false,
}: {
  serialNum?: string;
  excludeCreatedStatus?: boolean;
}) => {
  return useQuery(
    [SETEL_TERMINAL_QUERY_KEY.SERIAL_NUMBERS_INVENTORY, serialNum],
    () => getTerminalInventory({serialNum}),
    {
      keepPreviousData: true,
      select: (result) => {
        if (excludeCreatedStatus) {
          result.terminals = result.terminals.filter(
            (value) => value.status !== TerminalStatus.CREATED,
          );
        }
        return result.terminals.map((value) => ({
          value: value.serialNum,
          label: value.serialNum,
          metadata: value.serialNum,
        }));
      },
    },
  );
};

export const useGetTerminalIds = (filter: ITerminalTerminalIdFilterRequest) => {
  return useQuery(
    [SETEL_TERMINAL_QUERY_KEY.TERMINAL_IDS, filter],
    () => getTerminalTerminalIds(filter),
    {
      keepPreviousData: true,
      select: (result) =>
        result.items.map((value) => ({
          value: value.terminalId,
          label: value.terminalId,
          metadata: value.terminalId,
        })),
    },
  );
};

export const useImportSerialNumbers = () => {
  const queryClient = useQueryClient();
  return useMutation(importTerminalSerialNumbers, {
    onSuccess: () =>
      queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.SERIAL_NUMBERS_INVENTORY),
  });
};

export const useUpdateTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation(updateTerminal, {
    onSuccess: () => queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINAL_DETAIL),
  });
};

export const useSetelTerminals = (filter: Parameters<typeof getTerminals>[0]) => {
  return useQuery([SETEL_TERMINAL_QUERY_KEY.TERMINALS_LISTING, filter], () => getTerminals(filter));
};

export const useAddHostTerminalReg = () => {
  const queryClient = useQueryClient();
  return useMutation(addHostTerminalReg, {
    onSuccess: () => queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINAL_DETAIL),
  });
};

export const useEditHostTerminalReg = () => {
  const queryClient = useQueryClient();
  return useMutation(editHostTerminalReg, {
    onSuccess: () => queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINAL_DETAIL),
  });
};

export const useDeleteHostTerminalReg = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteHostTerminalReg, {
    onSuccess: () => queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINAL_DETAIL),
  });
};

export const useCheckPendingSettlement = (params: ITerminalGetPendingSettlementReq) => {
  return useQuery([SETEL_TERMINAL_QUERY_KEY.CHECK_PENDING_SETTLEMENT, params], () =>
    checkPendingSettlements(params),
  );
};

export const useDownloadTerminalReport = () => {
  return useMutation(downloadTerminalReports);
};

export const useDeactivateTerminal = () => {
  return useMutation(deactivateTerminal);
};

export const useUpdateTerminalInventory = () => {
  const queryClient = useQueryClient();
  return useMutation(updateTerminalInventory, {
    onSuccess: () =>
      queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINALS_INVENTORY_LISTING),
  });
};

export const useUploadCSV = () => {
  const queryClient = useQueryClient();
  return useMutation(uploadCSV, {
    onSuccess: () =>
      queryClient.invalidateQueries(SETEL_TERMINAL_QUERY_KEY.TERMINALS_INVENTORY_LISTING),
  });
};

export const useGetPaymentAcceptance = (merchantId: string) => {
  return useQuery(
    [SETEL_TERMINAL_QUERY_KEY.PAYMENT_ACCEPTANCE, merchantId],
    () => getMerchantPaymentMethods(merchantId),
    {
      select: (result) => {
        const isEnabledOnly = result.filter((value) => value.isEnabled);
        const enabledCards: Record<
          SetelTerminalCardType,
          {
            label: string;
            brands: string[];
          }
        > = {
          OPEN_LOOP_CARDS: {
            label: 'Open-loop card',
            brands: [],
          },
          CLOSED_LOOP_CARDS: {
            label: 'Closed-loop card',
            brands: [],
          },
        };

        for (const paymentMethod of isEnabledOnly) {
          /** If card brand mapping does not exist, skip this card */
          const cardBrand = CardBrandPrettyTextMapping[paymentMethod.brand];
          if (!cardBrand) continue;

          switch (GET_SETEL_TERMINAL_CARD_TYPE[paymentMethod.group]) {
            case SetelTerminalCardType.OPEN_LOOP_CARDS:
              enabledCards.OPEN_LOOP_CARDS.brands.push(cardBrand);
              break;
            case SetelTerminalCardType.CLOSED_LOOP_CARDS:
              enabledCards.CLOSED_LOOP_CARDS.brands.push(cardBrand);
              break;
          }
        }
        return enabledCards;
      },
    },
  );
};
