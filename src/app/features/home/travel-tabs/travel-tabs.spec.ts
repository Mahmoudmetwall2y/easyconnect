import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTabs } from './travel-tabs';

describe('TravelTabs', () => {
  let component: TravelTabs;
  let fixture: ComponentFixture<TravelTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
