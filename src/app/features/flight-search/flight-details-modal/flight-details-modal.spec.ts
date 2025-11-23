import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailsModal } from './flight-details-modal';

describe('FlightDetailsModal', () => {
  let component: FlightDetailsModal;
  let fixture: ComponentFixture<FlightDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
