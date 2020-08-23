import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsSearchFormComponent } from './goods-search-form.component';

describe('GoodsSearchFormComponent', () => {
  let component: GoodsSearchFormComponent;
  let fixture: ComponentFixture<GoodsSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
