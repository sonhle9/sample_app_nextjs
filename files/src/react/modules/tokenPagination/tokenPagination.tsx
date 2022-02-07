import {PaginationNavigation} from '@setel/portal-ui';
import * as React from 'react';

export type TokenPaginationProps = {
  tokens: string[];
  total: number;
  perPage: number;
  prev(): void;
  next(): void;
  setPerPage(pageSize: number): void;
};

export const TokenPagination: React.VFC<TokenPaginationProps> = ({
  tokens,
  total,
  perPage,
  prev,
  next,
  setPerPage,
}) => {
  return (
    <PaginationNavigation
      total={total}
      currentPage={tokens.length + 1}
      perPage={perPage}
      onChangePage={(page) => (tokens[page - 1] ? prev() : next())}
      onChangePageSize={setPerPage}
      className="p-4"
      variant="prev-next"
    />
  );
};
