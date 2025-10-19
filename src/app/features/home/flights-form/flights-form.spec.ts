import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsForm } from './flights-form';

describe('FlightsForm', () => {
  let component: FlightsForm;
  let fixture: ComponentFixture<FlightsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
