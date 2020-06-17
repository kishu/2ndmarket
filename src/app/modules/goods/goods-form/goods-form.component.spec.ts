import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsFormComponent } from './goods-form.component';

describe('GoodsFormComponent', () => {
  let component: GoodsFormComponent;
  let fixture: ComponentFixture<GoodsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
