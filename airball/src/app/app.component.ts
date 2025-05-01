import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CourtComponent } from './components/court/court.component';
import { NewShotComponent } from './components/new-shot/new-shot.component';
import { StatsDisplayComponent } from './components/stats-display/stats-display.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CourtComponent, NewShotComponent, StatsDisplayComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'airball';
}
