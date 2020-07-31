import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBootstrapComponent } from './group-bootstrap.component';

describe('GroupBootstrapComponent', () => {
  let component: GroupBootstrapComponent;
  let fixture: ComponentFixture<GroupBootstrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBootstrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
