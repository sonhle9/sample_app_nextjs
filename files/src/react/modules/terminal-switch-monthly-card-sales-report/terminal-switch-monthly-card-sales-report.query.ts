import {useEffect, useRef} from 'react';
import {useQuery} from 'react-query';
import {terminalSwitchMonthlyCardSalesReport} from './terminal-switch-monthly-card-sale-report.service';

const TERMINAL_SWITCH_MONTHLY_CARD_SALES_REPORT = 'terminal_switch_monthly_card_sales_report';

export const useTerminalSwitchCardSalesReport = (
  filter: Parameters<typeof terminalSwitchMonthlyCardSalesReport>[0],
) => {
  return useQuery([TERMINAL_SWITCH_MONTHLY_CARD_SALES_REPORT, filter], () =>
    terminalSwitchMonthlyCardSalesReport(filter),
  );
};

export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};
