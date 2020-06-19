import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsCommentListComponent } from './goods-comment-list.component';

describe('GoodsCommentListComponent', () => {
  let component: GoodsCommentListComponent;
  let fixture: ComponentFixture<GoodsCommentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsCommentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsCommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
