import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerForm } from './passenger-form';

describe('PassengerForm', () => {
  let component: PassengerForm;
  let fixture: ComponentFixture<PassengerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
