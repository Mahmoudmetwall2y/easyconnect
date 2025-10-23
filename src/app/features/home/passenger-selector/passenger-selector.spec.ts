import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerSelector } from './passenger-selector';

describe('PassengerSelector', () => {
  let component: PassengerSelector;
  let fixture: ComponentFixture<PassengerSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
