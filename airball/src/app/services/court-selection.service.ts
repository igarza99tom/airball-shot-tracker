import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CourtSection } from '../models/court-section.model';

@Injectable({
  providedIn: 'root'
})
export class CourtSelectionService {
  private selectedSectionSubject = new BehaviorSubject<CourtSection | null>(null);
  
  // Observable that other components can subscribe to
  public selectedSection$: Observable<CourtSection | null> = this.selectedSectionSubject.asObservable();
  
  constructor() { }
  
  /**
   * Updates the currently selected court section
   */
  selectSection(section: CourtSection | null): void {
    this.selectedSectionSubject.next(section);
  }
  
  /**
   * Returns the currently selected section
   */
  getCurrentSelection(): CourtSection | null {
    return this.selectedSectionSubject.getValue();
  }
}
