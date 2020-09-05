import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsListItemComponent } from './goods-list-item.component';

describe('GoodsListItemComponent', () => {
  let component: GoodsListItemComponent;
  let fixture: ComponentFixture<GoodsListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
