import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsCommentFormComponent } from './goods-comment-form.component';

describe('GoodsCommentFormComponent', () => {
  let component: GoodsCommentFormComponent;
  let fixture: ComponentFixture<GoodsCommentFormComponent>;

  beforeEach(async(() => {
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
