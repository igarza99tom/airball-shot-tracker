import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CourtSelectionService } from '../../services/court-selection.service';
import { CourtSection } from '../../models/court-section.model';

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-display.component.html',
  styleUrl: './stats-display.component.scss'
})
export class StatsDisplayComponent implements OnInit, OnDestroy {
  selectedSection: CourtSection | null = null;
  private subscription: Subscription = new Subscription();
  
  // Mock data for overall stats and recent shooting
  stats = {
    total: {
      shots: 56,
      makes: 32,
      percentage: 57.1
    }
  };
  
  recentShooting = [
    { id: 3, name: 'Top of Key 3', makes: 8, attempts: 10, percentage: 80 },
    { id: 8, name: 'Free Throw', makes: 12, attempts: 15, percentage: 80 },
    { id: 13, name: 'Dunk', makes: 5, attempts: 5, percentage: 100 }
  ];
  
  constructor(private courtSelectionService: CourtSelectionService) {}
  
  ngOnInit() {
    // Subscribe to section changes
    this.subscription = this.courtSelectionService.selectedSection$.subscribe(section => {
      this.selectedSection = section;
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    this.subscription.unsubscribe();
  }
  
  /**
   * Calculate section stats from selected section
   */
  getSectionStats() {
    if (!this.selectedSection) return { shots: 0, makes: 0, percentage: 0 };
    
    return {
      shots: this.selectedSection.total,
      makes: this.selectedSection.make,
      percentage: this.selectedSection.percentage.toFixed(1)
    };
  }
}