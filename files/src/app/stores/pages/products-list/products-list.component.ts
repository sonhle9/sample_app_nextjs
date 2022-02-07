import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {IProductListProps, ProductList} from 'src/react/modules/stores/components/product-list';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-products-list',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
  styleUrls: [],
})
export class ProductsListComponent {
  reactComponent = ProductList;
  reactProps: Observable<IProductListProps>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      to: '/stores/list',
      label: 'Stores',
    },
    {
      label: 'Store Items',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.reactProps = this.activatedRoute.paramMap.pipe(
      map((params) => ({storeId: params.get('storeId')})),
    );
  }
}
