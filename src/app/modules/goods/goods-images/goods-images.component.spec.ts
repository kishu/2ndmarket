import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsImagesComponent } from './goods-images.component';

describe('GoodsImageViewerComponent', () => {
  let component: GoodsImagesComponent;
  let fixture: ComponentFixture<GoodsImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
