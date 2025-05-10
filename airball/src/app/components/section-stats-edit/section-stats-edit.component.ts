import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourtSection } from '../../models/court-section.model';

interface SectionStats {
  makes: number;
  total: number;
}

@Component({
  selector: 'app-section-stats-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './section-stats-edit.component.html',
  styleUrl: './section-stats-edit.component.scss'
})
export class SectionStatsEditComponent implements OnInit, OnChanges {
  @Input() section!: CourtSection;
  @Output() saveChanges = new EventEmitter<SectionStats>();
  @Output() cancelEdit = new EventEmitter<void>();
  
  stats: SectionStats = { makes: 0, total: 0 };
  private currentSectionId: number = -1;
  
  ngOnInit(): void {
    this.initializeStats();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // If section changed while editing, cancel the edit
    if (changes['section'] && !changes['section'].firstChange) {
      const previousId = changes['section'].previousValue?.id;
      const currentId = changes['section'].currentValue?.id;
      
      if (previousId !== currentId) {
        // Section changed, cancel the current edit
        this.cancelEdit.emit();
        // Then initialize with the new section data
        this.initializeStats();
      }
    }
  }
  
  /**
   * Initialize stats from the current section
   */
  private initializeStats(): void {
    if (this.section) {
      this.currentSectionId = this.section.id;
      this.stats = {
        makes: this.section.make,
        total: this.section.total
      };
    }
  }
  
  /**
   * Validate the inputs whenever they change
   */
  validateInputs(): void {
    // Convert input values to numbers to handle string inputs
    this.stats.makes = Number(this.stats.makes);
    this.stats.total = Number(this.stats.total);
    
    // Ensure non-negative values
    if (this.stats.makes < 0) this.stats.makes = 0;
    if (this.stats.total < 0) this.stats.total = 0;
    
    // Ensure makes doesn't exceed total
    if (this.stats.makes > this.stats.total) {
      this.stats.makes = this.stats.total;
    }
  }
  
  onSave(): void {
    // Final validation before saving
    this.validateInputs();
    this.saveChanges.emit(this.stats);
  }
  
  onCancel(): void {
    this.cancelEdit.emit();
  }
  
  // Calculate percentage for preview
  getPercentage(): string {
    if (this.stats.total === 0) return '0.00';
    return ((this.stats.makes / this.stats.total) * 100).toFixed(2);
  }
}
