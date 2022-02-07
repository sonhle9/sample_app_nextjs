import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PasswordRecoveryCreateOtpComponent} from './createOtp';

describe('PasswordRecoveryCreateOtpComponent', () => {
  let component: PasswordRecoveryCreateOtpComponent;
  let fixture: ComponentFixture<PasswordRecoveryCreateOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordRecoveryCreateOtpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoveryCreateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
