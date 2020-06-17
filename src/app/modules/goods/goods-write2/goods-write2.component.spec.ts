import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsWrite2Component } from './goods-write2.component';

describe('GoodsWrite2Component', () => {
  let component: GoodsWrite2Component;
  let fixture: ComponentFixture<GoodsWrite2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsWrite2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsWrite2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
