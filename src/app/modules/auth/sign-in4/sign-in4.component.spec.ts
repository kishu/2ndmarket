import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignIn4Component } from './sign-in4.component';

describe('SignIn4Component', () => {
  let component: SignIn4Component;
  let fixture: ComponentFixture<SignIn4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignIn4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignIn4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
