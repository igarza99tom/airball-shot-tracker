import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourtComponent } from './court.component';
import { By } from '@angular/platform-browser';

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
  
  it('should initialize court sections', () => {
    expect(component.courtSections.length).toBeGreaterThan(0);
  });
  
  it('should select a section when clicked', () => {
    // Create a mock event
    const mockEvent = new MouseEvent('click');
    
    // Select a section
    component.handleSectionClick(1, mockEvent);
    expect(component.selectedSection).toBe(1);
    
    // Deselect the section when clicked again
    component.handleSectionClick(1, mockEvent);
    expect(component.selectedSection).toBeNull();
  });
  
  it('should render the court with all sections', () => {
    const sectionElements = fixture.debugElement.queryAll(By.css('.section-region'));
    expect(sectionElements.length).toBe(component.courtSections.length);
  });
});
