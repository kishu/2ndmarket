import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsImageViewerComponent } from './goods-image-viewer.component';

describe('GoodsImageViewerComponent', () => {
  let component: GoodsImageViewerComponent;
  let fixture: ComponentFixture<GoodsImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsImageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
