import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {ReactAdapterProvider, ReactAdapterService} from 'src/react/modules/adapter';
import {PlanDetails} from 'src/react/modules/bnpl-plan-config/components/plan-details';
import {BridgeComponent} from 'src/shared/interfaces/bridge-component.interface';

@Component({
  template: '<div #container [appBreadcrumbs]="breadcrumbs"></div>',
})
export class PlanDetailsComponent implements BridgeComponent {
  @ViewChild('container', {static: false}) wrapper: ElementRef<HTMLDivElement>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Financial services',
    },
    {
      label: 'Buy Now, Pay Later',
    },
    {
      label: 'BNPL Plans',
      to: '/buy-now-pay-later/plans',
    },
    {
      label: 'BNPL Plan details',
      to: '/buy-now-pay-later/plans/'+this.activatedRoute.snapshot.paramMap.get('id'),
    },
  ];

  private _id: string;

  constructor(
    private adapter: ReactAdapterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this._id = this.activatedRoute.snapshot.paramMap.get('id');

    this.router.events.subscribe((val: any) => {
      if (
        val?.snapshot?.routeConfig?.path === 'plans/details/:id' &&
        val?.snapshot?.params?.id !== undefined &&
        val?.snapshot?.params?.id !== this.activatedRoute.snapshot.params.id
      ) {
        this._id = val?.snapshot?.params?.id;
        this.render();
      }
    });
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.wrapper.nativeElement);
  }

  render() {
    if (this.wrapper && this.wrapper.nativeElement) {
      ReactDOM.render(
        <ReactAdapterProvider adapterService={this.adapter} activatedRoute={this.activatedRoute}>
          <PlanDetails id={this._id} />
        </ReactAdapterProvider>,
        this.wrapper.nativeElement,
      );
    }
  }
}
