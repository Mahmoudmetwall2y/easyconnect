import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsToolbar } from './results-toolbar';

describe('ResultsToolbar', () => {
  let component: ResultsToolbar;
  let fixture: ComponentFixture<ResultsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
