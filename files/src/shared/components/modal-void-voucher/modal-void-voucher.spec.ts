import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalVoidVoucherComponent} from './modal-void-voucher.component';

describe('ModalVoidVoucherComponent', () => {
  let component: ModalVoidVoucherComponent;
  let fixture: ComponentFixture<ModalVoidVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVoidVoucherComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVoidVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
