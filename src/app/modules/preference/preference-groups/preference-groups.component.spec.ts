import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceGroupsComponent } from './preference-groups.component';

describe('PreferenceGroupsComponent', () => {
  let component: PreferenceGroupsComponent;
  let fixture: ComponentFixture<PreferenceGroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
