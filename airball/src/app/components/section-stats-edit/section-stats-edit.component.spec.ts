import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionStatsEditComponent } from './section-stats-edit.component';

describe('SectionStatsEditComponent', () => {
  let component: SectionStatsEditComponent;
  let fixture: ComponentFixture<SectionStatsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionStatsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionStatsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
