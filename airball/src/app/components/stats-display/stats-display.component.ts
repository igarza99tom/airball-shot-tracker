import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-display.component.html',
  styleUrl: './stats-display.component.scss'
})
export class StatsDisplayComponent {
  sectionName: string | null = 'Left Short 2';
  
  // Mock data
  stats = {
    total: {
      shots: 56,
      makes: 32,
      percentage: 57.1
    },
    section: {
      shots: 10,
      makes: 5,
      percentage: 50
    },
    lastSessionDate: '2025-04-30'
  };
  
  recentShooting = [
    { id: 3, name: 'Top of Key 3', makes: 8, attempts: 10, percentage: 80 },
    { id: 8, name: 'Free Throw', makes: 12, attempts: 15, percentage: 80 },
    { id: 13, name: 'Dunk', makes: 5, attempts: 5, percentage: 100 }
  ];
}