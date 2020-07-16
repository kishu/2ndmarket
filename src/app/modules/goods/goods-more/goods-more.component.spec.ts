import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsMoreComponent } from './goods-more.component';

describe('GoodsMoreComponent', () => {
  let component: GoodsMoreComponent;
  let fixture: ComponentFixture<GoodsMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
