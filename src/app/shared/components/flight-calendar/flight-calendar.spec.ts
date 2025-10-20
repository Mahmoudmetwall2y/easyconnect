import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCalendar } from './flight-calendar';

describe('FlightCalendar', () => {
  let component: FlightCalendar;
  let fixture: ComponentFixture<FlightCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
