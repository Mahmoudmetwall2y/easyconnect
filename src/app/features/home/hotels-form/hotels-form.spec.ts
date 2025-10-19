import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsForm } from './hotels-form';

describe('HotelsForm', () => {
  let component: HotelsForm;
  let fixture: ComponentFixture<HotelsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
