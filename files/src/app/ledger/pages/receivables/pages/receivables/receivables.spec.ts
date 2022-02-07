import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LegacyReceivablesComponent} from './receivables';

describe('OrdersComponent', () => {
  let component: LegacyReceivablesComponent;
  let fixture: ComponentFixture<LegacyReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LegacyReceivablesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegacyReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
