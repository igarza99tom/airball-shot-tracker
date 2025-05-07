import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CourtSelectionService } from '../../services/court-selection.service';
import { CourtSection, SectionType } from '../../models/court-section.model';

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
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
  
  constructor(private courtSelectionService: CourtSelectionService) {}
  
  ngOnInit() {
    // Subscribe to section changes
    this.subscription.add(
      this.courtSelectionService.selectedSection$.subscribe(section => {
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
    
    // Calculate totals across all sections
    const totalShots = this.allSections.reduce((sum, section) => sum + section.total, 0);
    const totalMakes = this.allSections.reduce((sum, section) => sum + section.make, 0);
    
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
   * Get the best shooting spots (min 5 attempts)
   */
  getBestSpots(): CourtSection[] {
    // Only include sections with at least 5 attempts
    const validSections = this.allSections.filter(section => section.total >= 5);
    
    // Sort by percentage (highest first)
    return [...validSections]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3); // Return top 3
  }
  
  /**
   * Get the worst shooting spots (min 5 attempts)
   */
  getWorstSpots(): CourtSection[] {
    // Only include sections with at least 5 attempts
    const validSections = this.allSections.filter(section => section.total >= 5);
    
    // Sort by percentage (lowest first)
    return [...validSections]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3); // Return bottom 3
  }
}