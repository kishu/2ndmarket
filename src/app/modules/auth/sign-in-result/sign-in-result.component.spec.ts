import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInResultComponent } from './sign-in-result.component';

describe('SignInResultComponent', () => {
  let component: SignInResultComponent;
  let fixture: ComponentFixture<SignInResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
