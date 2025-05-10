import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CourtSelectionService } from '../../services/court-selection.service';
import { CourtSection, SectionType } from '../../models/court-section.model';
import { SectionStatsEditComponent } from '../section-stats-edit/section-stats-edit.component';

interface SectionStats {
  makes: number;
  total: number;
}

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule, SectionStatsEditComponent],
  templateUrl: './stats-display.component.html',
  styleUrl: './stats-display.component.scss'
})
export class StatsDisplayComponent implements OnInit, OnDestroy {
  selectedSection: CourtSection | null = null;
  allSections: CourtSection[] = [];
  private subscription: Subscription = new Subscription();
  
  // UI state for expandable sections
  statsExpanded: boolean = false;
  is3ptExpanded: boolean = false;
  isMidRangeExpanded: boolean = false;
  isPaintExpanded: boolean = false;
  isFreethrowExpanded: boolean = false;

  // Add property for edit mode
  sectionStatsEditable: boolean = false;
  
  constructor(private courtSelectionService: CourtSelectionService) {}
  
  /**
   * Subscribe to section changes
   */
  ngOnInit() {
    // Subscribe to section changes
    this.subscription.add(
      this.courtSelectionService.selectedSection$.subscribe(section => {
        // Check if the section has changed while in edit mode
        if (this.sectionStatsEditable && 
           (!section || this.selectedSection?.id !== section?.id)) {
          // Cancel edit mode when section changes
          this.sectionStatsEditable = false;
        }
        
        this.selectedSection = section;
      })
    );
    
    // Get all court sections
    this.subscription.add(
      this.courtSelectionService.getAllSections().subscribe(sections => {
        this.allSections = sections;
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  /**
   * Toggle expanded state of overall stats
   */
  toggleStatsExpanded(): void {
    this.statsExpanded = !this.statsExpanded;
  }
  
  /**
   * Toggle expanded state for 3pt shots
   */
  toggle3ptExpanded(): void {
    this.is3ptExpanded = !this.is3ptExpanded;
  }
  
  /**
   * Toggle expanded state for mid-range shots
   */
  toggleMidRangeExpanded(): void {
    this.isMidRangeExpanded = !this.isMidRangeExpanded;
  }
  
  /**
   * Toggle expanded state for paint shots
   */
  togglePaintExpanded(): void {
    this.isPaintExpanded = !this.isPaintExpanded;
  }

  /**
   * Toggle expanded state for free throws
   */
  toggleFreeThrowExpanded(): void {
    this.isFreethrowExpanded = !this.isFreethrowExpanded;
  }
  
  /**
   * Toggle section stats edit mode
   */
  toggleSectionStatsEdit(): void {
    this.sectionStatsEditable = !this.sectionStatsEditable;
  }
  
  /**
   * Save changes to section stats
   */
  saveSectionChanges(stats: SectionStats): void {
    if (!this.selectedSection) return;
    
    // Reset section to update the stats
    this.selectedSection.reset();
    
    // Apply the new stats
    if (stats.makes > 0) {
      // Add makes one by one
      for (let i = 0; i < stats.makes; i++) {
        this.selectedSection.addMake();
      }
      
      // Add remaining misses if any
      const misses = stats.total - stats.makes;
      for (let i = 0; i < misses; i++) {
        this.selectedSection.addMiss();
      }
    } else if (stats.total > 0) {
      // All shots were misses
      for (let i = 0; i < stats.total; i++) {
        this.selectedSection.addMiss();
      }
    }
    
    // Exit edit mode
    this.sectionStatsEditable = false;
  }
  
  /**
   * Cancel editing section stats
   */
  cancelSectionStatsEdit(): void {
    this.sectionStatsEditable = false;
  }
  
  /**
   * Calculate section stats from selected section
   */
  getSectionStats() {
    if (!this.selectedSection) return { shots: 0, makes: 0, percentage: 0 };
    
    return {
      shots: this.selectedSection.total,
      makes: this.selectedSection.make,
      percentage: this.selectedSection.percentage.toFixed(2)
    };
  }

  /**
   * Calculate total stats across all sections
   */
  getTotalStats() {
    // If no sections are available, return zeros
    if (!this.allSections || this.allSections.length === 0) {
      return {
        shots: 0,
        makes: 0,
        percentage: "0.00"
      };
    }
    
    // Filter out free throw sections for total field goal statistics
    const fieldGoalSections = this.allSections.filter(section => section.type !== SectionType.FreeThrow);
    
    // Calculate totals across all field goal sections (excluding free throws)
    const totalShots = fieldGoalSections.reduce((sum, section) => sum + section.total, 0);
    const totalMakes = fieldGoalSections.reduce((sum, section) => sum + section.make, 0);
    
    // Calculate overall percentage
    const percentage = totalShots > 0 ? (totalMakes / totalShots) * 100 : 0;
    
    return {
      shots: totalShots,
      makes: totalMakes,
      percentage: percentage.toFixed(2)
    };
  }
  
  /**
   * Get all 3-point sections
   */
  get3ptSections(): CourtSection[] {
    const sectionIds = [1, 2, 3, 4, 5]; // IDs for 3pt sections
    return this.allSections.filter(section => sectionIds.includes(section.id));
  }
  
  /**
   * Get 3-point shot statistics
   */
  get3ptStats() {
    const sections = this.get3ptSections();
    return this.calculateStatsForSections(sections);
  }
  
  /**
   * Get all mid-range sections
   */
  getMidRangeSections(): CourtSection[] {
    const sectionIds = [6, 7, 8, 9, 10, 11, 13]; // IDs for mid-range sections
    return this.allSections.filter(section => sectionIds.includes(section.id));
  }
  
  /**
   * Get mid-range shot statistics
   */
  getMidRangeStats() {
    const sections = this.getMidRangeSections();
    return this.calculateStatsForSections(sections);
  }
  
  /**
   * Get all paint sections
   */
  getPaintSections(): CourtSection[] {
    const sectionIds = [12, 14]; // IDs for paint sections
    return this.allSections.filter(section => sectionIds.includes(section.id));
  }
  
  /**
   * Get paint shot statistics
   */
  getPaintStats() {
    const sections = this.getPaintSections();
    return this.calculateStatsForSections(sections);
  }
  
  /**
   * Calculate stats for a given array of sections
   */
  private calculateStatsForSections(sections: CourtSection[]) {
    if (!sections || sections.length === 0) {
      return {
        shots: 0,
        makes: 0,
        percentage: "0.00"
      };
    }
    
    const totalShots = sections.reduce((sum, section) => sum + section.total, 0);
    const totalMakes = sections.reduce((sum, section) => sum + section.make, 0);
    const percentage = totalShots > 0 ? (totalMakes / totalShots) * 100 : 0;
    
    return {
      shots: totalShots,
      makes: totalMakes,
      percentage: percentage.toFixed(2)
    };
  }

  /**
   * Get all valid sections for ranking (with minimum attempts)
   */
  private getValidSectionsForRanking(): CourtSection[] {
    // Only include field goal sections (exclude free throws) with at least 5 attempts
    return this.allSections.filter(section => 
      section.total >= 5 && section.type !== SectionType.FreeThrow);
  }

  /**
   * Checks if there are any valid sections for best/worst spots
   */
  hasValidSectionsForRanking(): boolean {
    // Only consider field goal sections with at least 5 attempts as valid for ranking
    return this.allSections.some(section => 
      section.total >= 5 && section.type !== SectionType.FreeThrow);
  }

  /**
   * Get the best shooting spots (min 5 attempts, excluding free throws)
   */
  getBestSpots(): CourtSection[] {
    const validSections = this.getValidSectionsForRanking();
    
    // Sort by percentage (highest first)
    return [...validSections]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3); // Return top 3
  }

  /**
   * Get the worst shooting spots (min 5 attempts, excluding free throws)
   */
  getWorstSpots(): CourtSection[] {
    const validSections = this.getValidSectionsForRanking();
    
    // Sort by percentage (lowest first)
    return [...validSections]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3); // Return bottom 3
  }

  /**
   * Get free throw section
   */
  getFreeThrowSection(): CourtSection | undefined {
    return this.allSections.find(section => section.type === SectionType.FreeThrow);
  }

  /**
   * Get free throw statistics
   */
  getFreeThrowStats() {
    const section = this.getFreeThrowSection();
    return section ? {
      shots: section.total,
      makes: section.make,
      percentage: section.total > 0 ? (section.percentage).toFixed(2) : "0.00"
    } : {
      shots: 0,
      makes: 0,
      percentage: "0.00"
    };
  }

  /**
   * Check if any free throws have been attempted
   */
  hasFreethrowAttempts(): boolean {
    const section = this.getFreeThrowSection();
    return !!section && section.total > 0;
  }

  /**
   * Check if any 3pt shots have been attempted
   */
  has3ptAttempts(): boolean {
    const sections = this.get3ptSections();
    const totalShots = sections.reduce((sum, section) => sum + section.total, 0);
    return totalShots > 0;
  }

  /**
   * Check if any Mid Range shots have been attempted
   */
  hasMidRangeAttempts(): boolean {
    const sections = this.getMidRangeSections();
    const totalShots = sections.reduce((sum, section) => sum + section.total, 0);
    return totalShots > 0;
  }
  
  /**
   * Check if any Free Throws have been attempted
   */
  hasFreeThrowAttempts(): boolean {
    const section = this.getFreeThrowSection();
    const totalShots = section ? section.total : 0;
    return totalShots > 0;
  }

  /**
   * Check if any Paint shots have been attempted
   */
  hasPaintAttempts(): boolean {
    const sections = this.getPaintSections();
    const totalShots = sections.reduce((sum, section) => sum + section.total, 0);
    return totalShots > 0;
  }
}