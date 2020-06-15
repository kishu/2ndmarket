import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignIn3Component } from './sign-in3.component';

describe('SignIn3Component', () => {
  let component: SignIn3Component;
  let fixture: ComponentFixture<SignIn3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignIn3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignIn3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
