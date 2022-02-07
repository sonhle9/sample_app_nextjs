import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import cx from 'classnames';
import {
  classes,
  Text,
  DataTable as Table,
  DataTableRow as Tr,
  DataTableCell as Td,
  DataTableRowGroup,
  Badge,
  usePaginationState,
  PaginationNavigation,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import moment from 'moment';
import {bnplAccountBillsStatusColor} from '../bnpl-account.constant';
// import {useBnplAccountBills} from '../bnpl-account.queries';
import {BnplAccountBillsStatus, IBnplAccountBill} from '../bnpl-account.type';

export const BillList = () => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  // const {data} = useBnplAccountBills();
  const accountBills: IBnplAccountBill[] = [];
  for (let i = 0; i < 21; i++) {
    accountBills.push({
      bnpl_bill_id: '7083815-9876910-27102',
      status: BnplAccountBillsStatus.uncollectible,
      due_date: new Date('2021-12-11').toLocaleDateString(),
      bill_amount: 500,
      associated_instructions: '2x Installments',
    });
  }

  const pageContainer = () => {
    if (!accountBills) {
      return <PageContainer />;
    }

    return (
      <PageContainer heading="John Doe bin Ismail - Bills">
        <div className="card rounded-lg">
          <div className={cx('card-body')}>
            <div className={cx('ml-1')}>
              <Text className={classes.h2}>Bills</Text>
            </div>
          </div>
          <div className={cx('border')}>
            <Table>
              <DataTableRowGroup groupType="thead">
                <Tr>
                  <Td className="text-left">
                    <div className={cx('ml-2')}>BNPL BILL ID</div>
                  </Td>
                  <Td className="text-right">STATUS</Td>
                  <Td className="text-right">DUE DATE</Td>
                  <Td className="text-right">BILL AMOUNT (RM)</Td>
                  <Td className="text-right">ASSOCIATED INSTRUCTIONS</Td>
                </Tr>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {accountBills.map((bill, index) => (
                  <Tr
                    key={index}
                    render={(p) => (
                      <Link
                        {...p}
                        to={`buy-now-pay-later/accounts/details/7083815-9876910-27102/bills/${bill.bnpl_bill_id}`}
                      />
                    )}>
                    <Td className="text-left">
                      <Text className={cx('ml-2')}>{bill.bnpl_bill_id}</Text>
                    </Td>
  
                    <Td className="text-right">
                      <Badge color={bnplAccountBillsStatusColor[bill.status]}>{bill.status.toUpperCase()}</Badge>
                    </Td>
  
                    <Td>
                      <div className={cx('ml-2')}>
                        <Text className={cx('text-right')}>
                          {moment(bill.due_date).format('DD MMM YYYY')}
                        </Text>
                      </div>
                    </Td>
  
                    <Td>
                      <div className={cx('ml-2')}>
                        <Text className={cx('text-right')}>
                          {/* {moment(startDate).format('DD MMM YYYY')} */}
                          {bill.bill_amount}
                        </Text>
                      </div>
                    </Td>
  
                    <Td>
                      <div className={cx('ml-2')}>
                        <Text className={cx('text-right')}>
                          {/* {moment(startDate).format('DD MMM YYYY')} */}
                          {bill.associated_instructions}
                        </Text>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </DataTableRowGroup>
            </Table>
          </div>
          <div className="card-body">
            <PaginationNavigation
              total={accountBills.length}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          </div>
        </div>
      </PageContainer>
    );
  }

  return pageContainer();
};
