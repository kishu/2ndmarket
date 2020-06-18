import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesControlComponent } from './images-control.component';

describe('ImagesControlComponent', () => {
  let component: ImagesControlComponent;
  let fixture: ComponentFixture<ImagesControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
