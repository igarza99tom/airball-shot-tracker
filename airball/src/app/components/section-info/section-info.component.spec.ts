import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionInfoComponent } from './section-info.component';

describe('SectionInfoComponent', () => {
  let component: SectionInfoComponent;
  let fixture: ComponentFixture<SectionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
