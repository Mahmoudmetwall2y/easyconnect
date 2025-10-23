import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchBar } from './flight-search-bar';

describe('FlightSearchBar', () => {
  let component: FlightSearchBar;
  let fixture: ComponentFixture<FlightSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
