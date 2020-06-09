import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsWriteComponent } from './goods-write.component';

describe('GoodsWriteComponent', () => {
  let component: GoodsWriteComponent;
  let fixture: ComponentFixture<GoodsWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
