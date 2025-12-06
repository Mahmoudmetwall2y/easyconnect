import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceCalendarModal } from './price-calendar-modal';

describe('PriceCalendarModal', () => {
  let component: PriceCalendarModal;
  let fixture: ComponentFixture<PriceCalendarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceCalendarModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceCalendarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
