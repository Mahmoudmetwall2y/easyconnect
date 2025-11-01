import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreWorld } from './explore-world';

describe('ExploreWorld', () => {
  let component: ExploreWorld;
  let fixture: ComponentFixture<ExploreWorld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreWorld]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreWorld);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
