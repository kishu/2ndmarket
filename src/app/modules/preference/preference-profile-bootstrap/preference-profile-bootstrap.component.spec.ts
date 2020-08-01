import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceProfileBootstrapComponent } from './preference-profile-bootstrap.component';

describe('PreferenceProfileBootstrapComponent', () => {
  let component: PreferenceProfileBootstrapComponent;
  let fixture: ComponentFixture<PreferenceProfileBootstrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceProfileBootstrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceProfileBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
