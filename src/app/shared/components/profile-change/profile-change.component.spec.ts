import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangeComponent } from './profile-change.component';

describe('ProfileChangeComponent', () => {
  let component: ProfileChangeComponent;
  let fixture: ComponentFixture<ProfileChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
