import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CourtSection {
  id: number;
  name: string;
  make: number;
  miss: number;
  path: string;
  labelX: number;
  labelY: number;
}

@Component({
  selector: 'app-court',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent {
  selectedSection: number | null = null;
  
  courtSections: CourtSection[] = [
    // Left corner 3
    { 
      id: 1, 
      name: 'Left Corner 3', 
      make: 0, 
      miss: 0, 
      path: 'M 47.9 467.59 L 47.9 284.5 L 121.5 284.5 L 94.2 467.28 Z', 
      labelX: 80, 
      labelY: 380
    },
    // Left wing 3
    { 
      id: 2, 
      name: 'Left Wing 3', 
      make: 0, 
      miss: 0, 
      path: 'M 121.5 284.5 L 237.59 198.7 L 193.04 9.19 L 47.9 9.38 L 47.9 284.5 Z', 
      labelX: 150, 
      labelY: 150
    },
    // Top 3
    { 
      id: 3, 
      name: 'Top of Key 3', 
      make: 0, 
      miss: 0, 
      path: 'M 193.04 9.19 L 237.59 198.7 L 387.34 197.58 L 431.89 8.07 L 193.04 9.19 Z', 
      labelX: 315, 
      labelY: 100
    },
    // Right wing 3
    { 
      id: 4, 
      name: 'Right Wing 3', 
      make: 0, 
      miss: 0, 
      path: 'M 431.89 8.07 L 387.34 197.58 L 506.5 283 L 580.74 283 L 580.74 9.38 L 431.89 8.07 Z', 
      labelX: 480, 
      labelY: 150
    },
    // Right corner 3
    { 
      id: 5, 
      name: 'Right Corner 3', 
      make: 0, 
      miss: 0, 
      path: 'M 506.5 283 L 580.74 283 L 580.74 467.59 L 535.21 467.41 L 506.5 283 Z', 
      labelX: 545, 
      labelY: 380
    },
    // Left deep 2
    { 
      id: 6, 
      name: 'Left Deep 2', 
      make: 0, 
      miss: 0, 
      path: 'M 94.2 467.28 L 121.5 284.5 L 174 324.75 L 121.75 467.28 L 94.2 467.28 Z', 
      labelX: 135, 
      labelY: 380
    },
    // Left wing 2
    { 
      id: 7, 
      name: 'Left Wing 2', 
      make: 0, 
      miss: 0, 
      path: 'M 121.5 284.5 L 174 324.75 L 251.02 268.7 L 237.59 198.7 L 121.5 284.5 Z', 
      labelX: 190, 
      labelY: 260
    },
    // Top 2
    { 
      id: 8, 
      name: 'Top Key 2', 
      make: 0, 
      miss: 0, 
      path: 'M 237.59 198.7 L 251.02 268.7 L 375.68 267.55 L 387.34 197.58 L 237.59 198.7 Z', 
      labelX: 315, 
      labelY: 230
    },
    // Right wing 2
    { 
      id: 9, 
      name: 'Right Wing 2', 
      make: 0, 
      miss: 0, 
      path: 'M 387.34 197.58 L 375.68 267.55 L 453.84 322.94 L 506.5 283 L 387.34 197.58 Z', 
      labelX: 430, 
      labelY: 260
    },
    // Right deep 2
    { 
      id: 10, 
      name: 'Right Deep 2', 
      make: 0, 
      miss: 0, 
      path: 'M 453.84 322.94 L 506.5 283 L 535.21 467.41 L 506 467.43 L 453.84 322.94 Z', 
      labelX: 490, 
      labelY: 380
    },
    // Left Short 2
    { 
      id: 11, 
      name: 'Left Short 2', 
      make: 0, 
      miss: 0, 
      path: 'M 174 324.75 L 234.91 467.59 L 152.49 467.68 L 174 324.75 Z', 
      labelX: 190, 
      labelY: 400
    },
    // Left Paint
    { 
      id: 12, 
      name: 'Left Paint', 
      make: 0, 
      miss: 0, 
      path: 'M 174 324.75 L 251.02 268.7 L 260.17 347.74 L 234.92 467.59 L 174 324.75 Z', 
      labelX: 230, 
      labelY: 350
    },
    // Center Paint
    { 
      id: 13, 
      name: 'Center Paint', 
      make: 0, 
      miss: 0, 
      path: 'M 260.17 347.74 L 368.75 347.75 L 379.26 467.59 L 249.63 467.85 L 260.17 347.74 Z', 
      labelX: 315, 
      labelY: 400
    },
    // Right Paint
    { 
      id: 14, 
      name: 'Right Paint', 
      make: 0, 
      miss: 0, 
      path: 'M 368.75 347.75 L 375.68 267.55 L 453.84 322.94 L 379.26 467.59 L 368.75 347.75 Z', 
      labelX: 400, 
      labelY: 350
    },
    // Right Short 2
    { 
      id: 15, 
      name: 'Right Short 2', 
      make: 0, 
      miss: 0, 
      path: 'M 453.84 322.94 L 506 467.43 L 379.26 467.59 L 453.84 322.94 Z', 
      labelX: 440, 
      labelY: 400
    }
  ];

  selectSection(sectionId: number): void {
    this.selectedSection = sectionId;
    console.log('Selected section:', sectionId);
  }

  getSectionColor(section: CourtSection): string {
    if (this.selectedSection === section.id) {
      return 'rgba(255,119,0,0.7)';
    }
    
    // Calculate percentage if there are shots
    if (section.make + section.miss > 0) {
      const percentage = (section.make / (section.make + section.miss)) * 100;
      
      // Color based on percentage
      if (percentage >= 60) return 'rgba(0,255,0,0.4)'; // Good - green
      if (percentage >= 40) return 'rgba(255,255,0,0.4)'; // Average - yellow
      return 'rgba(255,0,0,0.4)'; // Poor - red
    }
    
    // Default color for sections with no shots
    return 'rgba(200,200,200,0.3)';
  }
}