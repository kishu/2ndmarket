import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsCommentFormComponent } from './goods-comment-form.component';

describe('GoodsCommentFormComponent', () => {
  let component: GoodsCommentFormComponent;
  let fixture: ComponentFixture<GoodsCommentFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsCommentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
