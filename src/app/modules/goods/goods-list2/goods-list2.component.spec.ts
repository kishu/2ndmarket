import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsList2Component } from './goods-list2.component';

describe('GoodsList2Component', () => {
  let component: GoodsList2Component;
  let fixture: ComponentFixture<GoodsList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
