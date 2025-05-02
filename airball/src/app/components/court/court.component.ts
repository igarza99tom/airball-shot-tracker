import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourtSection, SectionType } from '../../models/court-section.model';

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
    // 1. Left Corner 3
    new CourtSection(
      1, 
      SectionType.LeftCorner3,
      'M 47.9 9.37 L 47.9 192.46 L 121.5 192.46 L 94.2 9.68 Z', 
      80, 
      100
    ),
    // 2. Left Wing 3
    new CourtSection(
      2, 
      SectionType.LeftWing3,
      'M 121.5 192.46 L 237.59 278.26 L 193.04 467.77 L 47.9 467.58 L 47.9 192.46 Z', 
      150, 
      330
    ),
    // 3. Top of Key 3
    new CourtSection(
      3, 
      SectionType.TopKey3,
      'M 193.04 467.77 L 237.59 278.26 L 387.34 279.38 L 431.89 468.89 L 193.04 467.77 Z', 
      315, 
      380
    ),
    // 4. Right Wing 3
    new CourtSection(
      4, 
      SectionType.RightWing3,
      'M 431.89 468.89 L 387.34 279.38 L 506.5 193.96 L 580.74 193.96 L 580.74 467.58 L 431.89 468.89 Z', 
      480, 
      330
    ),
    // 5. Right Corner 3
    new CourtSection(
      5, 
      SectionType.RightCorner3,
      'M 506.5 193.96 L 580.74 193.96 L 580.74 9.37 L 535.21 9.55 L 506.5 193.96 Z', 
      545, 
      100
    ),
    // 6. Left Deep 2
    new CourtSection(
      6, 
      SectionType.LeftDeep2,
      'M 94.2 9.68 L 121.5 192.46 L 174 152.21 L 121.75 9.68 L 94.2 9.68 Z', 
      135, 
      100
    ),
    // 7. Left Wing 2
    new CourtSection(
      7, 
      SectionType.LeftWing2,
      'M 121.5 192.46 L 174 152.21 L 251.02 208.26 L 237.59 278.26 L 121.5 192.46 Z', 
      190, 
      220
    ),
    // 8. Top Key 2
    new CourtSection(
      8, 
      SectionType.TopKey2,
      'M 237.59 278.26 L 251.02 208.26 L 375.68 209.41 L 387.34 279.38 L 237.59 278.26 Z', 
      315, 
      250
    ),
    // 9. Right Wing 2
    new CourtSection(
      9, 
      SectionType.RightWing2,
      'M 387.34 279.38 L 375.68 209.41 L 453.84 154.02 L 506.5 193.96 L 387.34 279.38 Z', 
      430, 
      220
    ),
    // 10. Right Deep 2
    new CourtSection(
      10, 
      SectionType.RightDeep2,
      'M 453.84 154.02 L 506.5 193.96 L 535.21 9.55 L 506 9.53 L 453.84 154.02 Z', 
      490, 
      100
    ),
    // 11. Left Short 2 (Merged Left Short 2 and Left Paint)
    new CourtSection(
      11, 
      SectionType.LeftShort2,
      'M 152.49 9.28 L 174 152.21 L 251.02 208.26 L 260.17 129.22 L 249.63 9.11 Z', 
      200, 
      100
    ),
    // 12. Center Short 2
    new CourtSection(
      12, 
      SectionType.CenterShort2,
      'M 260.17 129.22 L 251.02 208.26 L 375.68 209.41 L 368.75 129.21 L 260.17 129.22 Z', 
      315, 
      170
    ),
    // 13. Right Short 2 (Merged Right Short 2 and Right Paint)
    new CourtSection(
      13, 
      SectionType.RightShort2,
      'M 368.75 129.21 L 375.68 209.41 L 453.84 154.02 L 506 9.53 L 379.26 9.11 L 368.75 129.21 Z', 
      420, 
      100
    ),
    // 14. Layup (Center Paint)
    new CourtSection(
      14, 
      SectionType.Layup,
      'M 249.63 9.11 L 260.17 129.22 L 368.75 129.21 L 379.26 9.11 L 249.63 9.11 Z', 
      315, 
      70
    ),
  ];

  selectSection(sectionId: number): void {
    this.selectedSection = sectionId;
    console.log(`Selected section: ${sectionId}`);
    // Will integrate with shot tracking service later
  }

  getSectionColor(section: CourtSection): string {
    // Default light color
    const baseColor = 'rgba(255,255,255,0.1)';
    
    // If selected, highlight it
    if (this.selectedSection === section.id) {
      return 'rgba(255,119,0,0.3)';
    }
    
    // Return color based on shooting percentage if shots attempted
    if (section.total > 0) {
      const percentage = section.percentage;
      if (percentage >= 60) return 'rgba(0,200,0,0.3)';
      if (percentage >= 40) return 'rgba(144,238,144,0.3)';
      if (percentage >= 30) return 'rgba(255,255,0,0.3)';
      return 'rgba(255,0,0,0.2)';
    }
    
    return baseColor;
  }
}