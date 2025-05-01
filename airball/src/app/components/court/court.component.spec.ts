import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtComponent } from './court.component';

describe('CourtComponent', () => {
  let component: CourtComponent;
  let fixture: ComponentFixture<CourtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
