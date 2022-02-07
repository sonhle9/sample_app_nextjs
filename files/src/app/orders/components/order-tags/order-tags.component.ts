import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {ApiOrderService} from 'src/app/api-orders.service';

const tagValidator =
  (getAllTags: () => string[]) =>
  ({value}: AbstractControl): Record<string, boolean> | null => {
    if (!value) {
      return null;
    }

    const checks = [
      value.length > 25 && {lengthError: true},
      !/^[a-z0-9_\-]+$/.test(value) && {tagError: true},
      getAllTags().includes(value) && {duplicateError: true},
    ];

    return checks.find(Boolean) || null;
  };

@Component({
  selector: 'app-order-tags',
  templateUrl: './order-tags.component.html',
  styleUrls: ['./order-tags.component.scss'],
})
export class OrderTagsComponent implements OnInit, OnDestroy {
  @Input()
  orderId: string;

  subscription;

  tagForm = this.fb.group({
    tag: ['', tagValidator(this.getTags.bind(this))],
  });

  constructor(private fb: FormBuilder, private apiOrderService: ApiOrderService) {}

  ngOnInit() {
    this.subscription = this.apiOrderService.order(this.orderId).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.apiOrderService.clearOrders(this.orderId);
  }

  getTags() {
    const {orders} = this.apiOrderService;

    return orders[this.orderId] && orders[this.orderId].data
      ? orders[this.orderId].data.adminTags
      : [];
  }

  onRemoveTag(tag: string) {
    this.apiOrderService
      .removeTag({
        tag,
        orderId: this.orderId,
      })
      .subscribe();
  }

  onSubmitTag() {
    if (this.tagForm.valid) {
      this.apiOrderService
        .addTag({
          orderId: this.orderId,
          tag: this.tagForm.value.tag,
        })
        .subscribe(() => {
          this.tagForm.reset();
        });
    }
  }
}
