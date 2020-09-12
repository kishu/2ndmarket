import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitTimerComponent } from './limit-timer.component';

describe('LimitTimerComponent', () => {
  let component: LimitTimerComponent;
  let fixture: ComponentFixture<LimitTimerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
