import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaeOverlaySpinnerComponent } from './dae-overlay-spinner.component';

describe('DaeOverlaySpinnerComponent', () => {
  let component: DaeOverlaySpinnerComponent;
  let fixture: ComponentFixture<DaeOverlaySpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaeOverlaySpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaeOverlaySpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
