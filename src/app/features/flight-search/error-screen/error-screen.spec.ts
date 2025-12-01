import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorScreen } from './error-screen';

describe('ErrorScreen', () => {
  let component: ErrorScreen;
  let fixture: ComponentFixture<ErrorScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
