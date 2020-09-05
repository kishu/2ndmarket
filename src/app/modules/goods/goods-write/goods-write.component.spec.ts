import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsWriteComponent } from './goods-write.component';

describe('GoodsWrite2Component', () => {
  let component: GoodsWriteComponent;
  let fixture: ComponentFixture<GoodsWriteComponent>;

  beforeEach(waitForAsync(() => {
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
