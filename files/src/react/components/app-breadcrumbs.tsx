import {Breadcrumbs} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from '../routing/link';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface IAppBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function AppBreadcrumbs(props: IAppBreadcrumbsProps) {
  return (
    <Breadcrumbs className="px-2 mb-4">
      {props.items?.map((item, index) =>
        item.to ? (
          <Link key={index} to={item.to}>
            {item.label}
          </Link>
        ) : (
          <span key={index}>{item.label}</span>
        ),
      )}
    </Breadcrumbs>
  );
}
