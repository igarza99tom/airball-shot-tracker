import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { NewShotComponent } from './new-shot.component';
import { CourtSelectionService } from '../../services/court-selection.service';
import { CourtSection, SectionType } from '../../models/court-section.model';
import { BehaviorSubject, of } from 'rxjs';

// Create mock service
class MockCourtSelectionService {
  // Create a subject we can control in tests
  private selectedSectionSubject = new BehaviorSubject<CourtSection | null>(null);
  selectedSection$ = this.selectedSectionSubject.asObservable();
  
  selectSection(section: CourtSection | null): void {
    this.selectedSectionSubject.next(section);
  }
  
  getCurrentSelection(): CourtSection | null {
    return this.selectedSectionSubject.getValue();
  }
}

describe('NewShotComponent', () => {
  let component: NewShotComponent;
  let fixture: ComponentFixture<NewShotComponent>;
  let mockSelectionService: MockCourtSelectionService;
  
  // Sample court section for testing
  const sampleSection = new CourtSection(
    1,
    SectionType.LeftCorner3,
    'path-data',
    100,
    100
  );

  beforeEach(async () => {
    mockSelectionService = new MockCourtSelectionService();
    
    await TestBed.configureTestingModule({
      imports: [NewShotComponent],
      providers: [
        { provide: CourtSelectionService, useValue: mockSelectionService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewShotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display the selection prompt when no section is selected', () => {
    mockSelectionService.selectSection(null);
    fixture.detectChanges();
    
    const promptElement = fixture.nativeElement.querySelector('.selection-prompt');
    expect(promptElement).toBeTruthy();
    
    const cardElement = fixture.nativeElement.querySelector('.card');
    expect(cardElement).toBeFalsy();
  });
  
  it('should display the shot card when a section is selected', () => {
    mockSelectionService.selectSection(sampleSection);
    fixture.detectChanges();
    
    const cardElement = fixture.nativeElement.querySelector('.card');
    expect(cardElement).toBeTruthy();
    
    const promptElement = fixture.nativeElement.querySelector('.selection-prompt');
    expect(promptElement).toBeFalsy();
    
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toContain(sampleSection.name);
  });
  
  it('should track drag state correctly', () => {
    mockSelectionService.selectSection(sampleSection);
    fixture.detectChanges();
    
    // Initialize drag
    const cardElement = fixture.nativeElement.querySelector('.card');
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: 100
    });
    
    component.startDrag(mouseEvent);
    expect(component.isDragging).toBeTrue();
    expect(component.startX).toBe(100);
    
    // Clean up event listeners to avoid memory leaks in tests
    document.dispatchEvent(new MouseEvent('mouseup'));
  });
  
  it('should record a make shot correctly when swiping right', () => {
    mockSelectionService.selectSection(sampleSection);
    fixture.detectChanges();
    
    // Set up spies
    spyOn(sampleSection, 'addMake');
    
    // Simulate swipe right
    component.startX = 100;
    component.currentX = 250; // Moved right more than threshold
    component['recordShot'](true);
    
    expect(sampleSection.addMake).toHaveBeenCalled();
  });
  
  it('should record a miss shot correctly when swiping left', () => {
    mockSelectionService.selectSection(sampleSection);
    fixture.detectChanges();
    
    // Set up spies
    spyOn(sampleSection, 'addMiss');
    
    // Simulate swipe left
    component.startX = 250;
    component.currentX = 100; // Moved left more than threshold
    component['recordShot'](false);
    
    expect(sampleSection.addMiss).toHaveBeenCalled();
  });
  
  it('should clean up subscriptions when component is destroyed', () => {
    spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
