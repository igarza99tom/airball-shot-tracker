import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-court',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent {
  selectedSection: number | null = null;
  
  courtSections = [
    { id: 1, name: 'Left Corner 3', make: 0, miss: 0, x: 50, y: 250 },
    { id: 2, name: 'Left Wing 3', make: 0, miss: 0, x: 100, y: 150 },
    { id: 3, name: 'Top of Key 3', make: 0, miss: 0, x: 200, y: 100 },
    { id: 4, name: 'Right Wing 3', make: 0, miss: 0, x: 300, y: 150 },
    { id: 5, name: 'Right Corner 3', make: 0, miss: 0, x: 350, y: 250 },
    { id: 6, name: 'Left Mid-Range', make: 0, miss: 0, x: 125, y: 200 },
    { id: 7, name: 'Left Elbow', make: 0, miss: 0, x: 150, y: 150 },
    { id: 8, name: 'Free Throw', make: 0, miss: 0, x: 200, y: 150 },
    { id: 9, name: 'Right Elbow', make: 0, miss: 0, x: 250, y: 150 },
    { id: 10, name: 'Right Mid-Range', make: 0, miss: 0, x: 275, y: 200 },
    { id: 11, name: 'Left Layup', make: 0, miss: 0, x: 160, y: 250 },
    { id: 12, name: 'Right Layup', make: 0, miss: 0, x: 240, y: 250 },
    { id: 13, name: 'Dunk', make: 0, miss: 0, x: 200, y: 270 },
    { id: 14, name: 'Free Throw', make: 0, miss: 0, x: 200, y: 170 },
  ];

  selectSection(sectionId: number): void {
    this.selectedSection = sectionId;
    console.log('Selected section:', sectionId);
  }
}
