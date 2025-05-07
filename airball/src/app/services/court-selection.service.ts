import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CourtSection } from '../models/court-section.model';

@Injectable({
  providedIn: 'root'
})
export class CourtSelectionService {
  private selectedSectionSubject = new BehaviorSubject<CourtSection | null>(null);
  private allSectionsSubject = new BehaviorSubject<CourtSection[]>([]);
  
  // Observables that other components can subscribe to
  public selectedSection$: Observable<CourtSection | null> = this.selectedSectionSubject.asObservable();
  public allSections$: Observable<CourtSection[]> = this.allSectionsSubject.asObservable();
  
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
  
  /**
   * Updates the collection of all court sections
   * This should be called by the CourtComponent after initializing sections
   */
  updateAllSections(sections: CourtSection[]): void {
    this.allSectionsSubject.next(sections);
  }
  
  /**
   * Returns an observable of all court sections
   */
  getAllSections(): Observable<CourtSection[]> {
    return this.allSections$;
  }
}
