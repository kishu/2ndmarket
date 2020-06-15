import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAddComponent } from './groups-add.component';

describe('GroupAddComponent', () => {
  let component: GroupsAddComponent;
  let fixture: ComponentFixture<GroupsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
