import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsSearchListComponent } from './goods-search-list.component';

describe('GoodsSearchListComponent', () => {
  let component: GoodsSearchListComponent;
  let fixture: ComponentFixture<GoodsSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
