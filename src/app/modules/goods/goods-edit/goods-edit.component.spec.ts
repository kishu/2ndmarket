import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsEditComponent } from './goods-edit.component';

describe('GoodsEditComponent', () => {
  let component: GoodsEditComponent;
  let fixture: ComponentFixture<GoodsEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
