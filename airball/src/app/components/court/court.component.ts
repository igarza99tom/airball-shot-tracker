import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourtSection, SectionType } from '../../models/court-section.model';
import { CourtSelectionService } from '../../services/court-selection.service';

@Component({
  selector: 'app-court',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent implements OnInit {
  // Section state
  selectedSection: number | null = null;
  hoveredSection: number | null = null;
  
  // UI state
  hoverTimer: any = null;
  isTouchDevice: boolean = false;
  
  // Court data
  courtSections: CourtSection[] = [];

  constructor(
    private ngZone: NgZone,
    private courtSelectionService: CourtSelectionService
  ) {
    this.detectTouchDevice();
  }

  ngOnInit(): void {
    this.initializeCourtSections();
    // Share all sections with the service so other components can access them
    this.courtSelectionService.updateAllSections(this.courtSections);
  }

  // SECTION: Event Handlers
  
  /**
   * Handles click on a section region
   */
  handleSectionClick(sectionId: number, event: MouseEvent): void {
    // Skip if this is triggered by a touch event on mobile
    if (this.isTouchDevice && event.detail === 0) {
      return;
    }
    
    this.handleSectionSelection(sectionId);
  }

  /**
   * Handles touch events for mobile devices
   */
  onSectionTouch(event: TouchEvent, sectionId: number): void {
    event.preventDefault();
    
    this.toggleSectionSelection(sectionId);
    
    // Handle the hover state with timer for visual feedback
    this.clearHoverTimer();
    this.hoveredSection = sectionId;
    
    // Use timer to clear hover effect
    this.ngZone.runOutsideAngular(() => {
      this.hoverTimer = setTimeout(() => {
        this.ngZone.run(() => {
          this.hoveredSection = null;
        });
      }, 1000);
    });
  }
  
  /**
   * Handles mouse enter events for desktop hover effects
   */
  onSectionMouseEnter(sectionId: number): void {
    if (this.isTouchDevice) return;
    
    this.clearHoverTimer();
    this.hoveredSection = sectionId;
  }
  
  /**
   * Handles mouse leave events for desktop hover effects
   */
  onSectionMouseLeave(): void {
    if (this.isTouchDevice) return;
    
    this.clearHoverTimer();
    this.hoveredSection = null;
  }
  
  // SECTION: Helper Methods
  
  /**
   * Toggles selection state of a court section
   */
  private toggleSectionSelection(sectionId: number): void {
    if (this.selectedSection === sectionId) {
      this.selectedSection = null;
      // Update the service with null selection
      this.courtSelectionService.selectSection(null);
    } else {
      this.selectedSection = sectionId;
      // Find the selected section and update the service
      const section = this.courtSections.find(s => s.id === sectionId) || null;
      this.courtSelectionService.selectSection(section);
    }
  }
  
  /**
   * Determines color for a court section based on shooting percentage
   */
  getSectionColor(section: CourtSection): string {
    // If selected, use CSS animation with custom property
    if (this.selectedSection === section.id) {
      return 'var(--section-color)';
    }
    
    // If hovered with active timer, use hover style
    if (this.hoveredSection === section.id) {
      return 'rgba(255, 255, 255, 0.5)';
    }
    
    return this.getPercentageBasedColor(section);
  }
  
  /**
   * Returns the color for CSS variable based on shooting percentage
   */
  getSectionBaseColor(section: CourtSection): string {
    return this.getPercentageBasedColor(section);
  }
  
  /**
   * Helper method to check if a section is selected
   */
  isSelected(sectionId: number): boolean {
    return this.selectedSection === sectionId;
  }
  
  /**
   * Clears any active hover timer
   */
  private clearHoverTimer(): void {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }
  
  /**
   * Gets color based on shooting percentage with different thresholds for different section types
   */
  private getPercentageBasedColor(section: CourtSection): string {
    // Default light color when no shots attempted
    const baseColor = 'rgba(255, 255, 255, 0.1)';
    
    // Return color based on shooting percentage if shots attempted
    if (section.total > 0) {
      const percentage = section.percentage;
      
      // 3-pointers (sections 1-5)
      if (section.id >= 1 && section.id <= 5) {
        if (percentage >= 45) return 'rgba(0,200,0,0.3)';
        if (percentage >= 35) return 'rgba(144,238,144,0.4)';
        if (percentage >= 25) return 'rgba(255,255,0,0.3)';
        return 'rgba(255, 0, 0, 0.3)';
      }
      
      // Long 2-pointers (sections 6-10)
      else if (section.id >= 6 && section.id <= 10) {
        if (percentage >= 50) return 'rgba(0,200,0,0.3)';
        if (percentage >= 40) return 'rgba(144,238,144,0.4)';
        if (percentage >= 30) return 'rgba(255,255,0,0.3)';
        return 'rgba(255, 0, 0, 0.3)';
      }
      
      // Short 2-pointers (sections 11-13)
      else if (section.id >= 11 && section.id <= 13) {
        if (percentage >= 55) return 'rgba(0,200,0,0.3)';
        if (percentage >= 45) return 'rgba(144,238,144,0.4)';
        if (percentage >= 35) return 'rgba(255,255,0,0.3)';
        return 'rgba(255, 0, 0, 0.3)';
      }
      
      // Layups (section 14)
      else if (section.id === 14) {
        if (percentage >= 60) return 'rgba(0,200,0,0.3)';
        if (percentage >= 50) return 'rgba(144,238,144,0.4)';
        if (percentage >= 40) return 'rgba(255,255,0,0.3)';
        return 'rgba(255, 0, 0, 0.3)';
      }
      
      // Free throws (section 15)
      else if (section.id === 15) {
        if (percentage >= 80) return 'rgba(0,200,0,0.3)';
        if (percentage >= 65) return 'rgba(144,238,144,0.4)';
        if (percentage >= 50) return 'rgba(255,255,0,0.3)';
        return 'rgba(255, 0, 0, 0.3)';
      }
    }
    
    return baseColor;
  }

  /**
   * Detects if the current device is a touch device
   */
  private detectTouchDevice(): void {
    const hasTouchCapability = 'ontouchstart' in window || 
                              navigator.maxTouchPoints > 0;
    
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                            .test(navigator.userAgent);
    
    this.isTouchDevice = hasTouchCapability && mobileUserAgent;
  }

  /**
   * Returns the ID of the free throw section or -1 if not found
   */
  getFreeThrowSectionId(): number {
    const freeThrowSection = this.courtSections.find(s => s.type === SectionType.FreeThrow);
    return freeThrowSection ? freeThrowSection.id : -1;
  }

  /**
   * Handles click on free throw button
   */
  handleFreeThrowClick(event: MouseEvent): void {
    // Skip if this is triggered by a touch event on mobile
    if (this.isTouchDevice && event.detail === 0) {
      return;
    }
    
    this.selectFreeThrow();
  }

  /**
   * Handles touch on free throw button for mobile devices
   */
  onFreeThrowTouch(event: TouchEvent): void {
    event.preventDefault();
    this.selectFreeThrow();
  }

  /**
   * Selects or deselects the free throw section
   */
  private selectFreeThrow(): void {
    const freeThrowSection = this.courtSections.find(s => s.type === SectionType.FreeThrow);
    
    if (freeThrowSection) {
      // Toggle selection just like other sections
      if (this.selectedSection === freeThrowSection.id) {
        // Deselect if already selected
        this.selectedSection = null;
        this.courtSelectionService.selectSection(null);
      } else {
        // Select if not already selected
        this.selectedSection = freeThrowSection.id;
        this.courtSelectionService.selectSection(freeThrowSection);
      }
    }
  }

  /**
   * Gets the fill color for the free throw button based on the percentage
   * with colors consistent with court sections
   */
  getFreeThrowFillColor(): string {
    const freeThrowSection = this.courtSections.find(s => s.type === SectionType.FreeThrow);
    
    if (!freeThrowSection || freeThrowSection.total === 0) {
      return '#f0bc81'; // Base court color when no shots taken
    }
    
    const percentage = freeThrowSection.percentage;
    
    // Use the exact same colors as in getPercentageBasedColor for free throws
    if (percentage >= 80) {
      return 'rgba(0, 168, 0, 0.9)'; // Green for high percentage (more opaque for button)
    } else if (percentage >= 65) {
      return 'rgba(134, 192, 95, 0.9)'; // Light green (more opaque for button)
    } else if (percentage >= 50) {
      return 'rgb(236, 185, 15)'; // Yellow (more opaque for button)
    } else {
      return 'rgba(200, 40, 40, 0.9)'; // Red (more opaque for button)
    }
  }

  /**
   * Handles click on a section label
   */
  handleLabelClick(sectionId: number, event: MouseEvent): void {
    // Skip if this is triggered by a touch event on mobile
    if (this.isTouchDevice && event.detail === 0) {
      return;
    }
    
    this.handleSectionSelection(sectionId);
  }

  /**
   * Handles touch on a section label
   */
  onLabelTouch(event: TouchEvent, sectionId: number): void {
    event.preventDefault();
    this.handleSectionSelection(sectionId);
  }

  /**
   * Common method to handle section selection from both direct section clicks and label clicks
   */
  private handleSectionSelection(sectionId: number): void {
    // Toggle selection
    if (this.selectedSection === sectionId) {
      // Deselect if already selected
      this.selectedSection = null;
      this.courtSelectionService.selectSection(null);
    } else {
      // Select if not already selected
      this.selectedSection = sectionId;
      const section = this.courtSections.find(s => s.id === sectionId);
      if (section) {
        this.courtSelectionService.selectSection(section);
      }
    }
  }
  
  /**
   * Generates random test data for court sections
   */
  private generateTestData(): void {
    this.courtSections.forEach(section => {
      section.total = Math.floor(Math.random() * 100);
      section.make = Math.floor(Math.random() * section.total);
    });
  }

  /**
   * Initializes court sections with path data
   */
  private initializeCourtSections(): void {
    this.courtSections = [
      new CourtSection(
        1, 
        SectionType.LeftCorner3,
        'M 50,101 V 11.5 H 70.935688 91.871376 L 91.307973,76.75 90.74457,142 l 2.200859,6.5 c 3.41568,10.08785 11.805581,24.76498 22.926541,40.10725 1.33857,1.84667 0.55348,1.89275 -32.249998,1.89275 H 50 Z', 
        80, 
        50
      ),
      new CourtSection(
        2, 
        SectionType.LeftWing3,
        'M 50,330 V 194.5 h 35.325393 35.325397 l 5.4246,6.72477 c 12.23528,15.16782 35.89964,36.88143 55.21464,50.66309 10.67441,7.61641 30.92025,19.07952 42.85865,24.26639 6.00238,2.60785 10.74433,5.21499 10.53766,5.79365 -0.20666,0.57865 -10.00748,42.1146 -21.77959,92.3021 L 191.50291,465.5 H 120.75146 50 Z',
        120, 
        330
      ),
      new CourtSection(
        3, 
        SectionType.TopKey3,
        'm 196.54024,462.25 c 0.34698,-1.7875 9.95672,-42.85 21.35499,-91.25 15.90435,-67.53396 21.05911,-87.9678 22.16445,-87.86155 0.79218,0.0762 5.49032,1.33947 10.44032,2.80739 23.12193,6.85679 40.15654,8.95781 67.25527,8.29515 22.61499,-0.55302 35.72803,-2.37772 56.14202,-7.81227 6.2685,-1.66878 11.70361,-2.67293 12.07802,-2.23143 0.3744,0.44149 10.00621,40.62771 21.40401,89.30271 11.3978,48.675 20.95552,89.2875 21.23937,90.25 0.48943,1.65961 -5.50696,1.75 -116.09662,1.75 h -116.6127 z',
        315, 
        380
      ),
      new CourtSection(
        4, 
        SectionType.RightWing3,
        'm 432.66574,463.25 c -4.09551,-16.72164 -41.70133,-177.86607 -41.89734,-179.53398 -0.23757,-2.02159 0.82828,-2.71813 9.27765,-6.06299 36.71268,-14.5335 75.81237,-43.19219 102.19188,-74.90303 l 6.03111,-7.25 H 543.63452 579 v 135 135 h -72.89159 -72.89159 z',
        510, 
        330
      ),
      new CourtSection(
        5, 
        SectionType.RightCorner3,
        'm 512.16781,190.75 c 0.18396,-0.4125 2.89348,-4.60108 6.02116,-9.30796 7.5076,-11.29826 13.15796,-21.95358 15.87783,-29.94204 2.11861,-6.22251 2.24694,-8.63455 3.00603,-56.5 0.43612,-27.5 0.82315,-57.5375 0.86006,-66.75 L 538,11.5 h 20.5 20.5 v 90 90 h -33.58333 c -18.47084,0 -33.43282,-0.3375 -33.24886,-0.75 z',
        548, 
        50
      ),
      new CourtSection(
        6, 
        SectionType.LeftDeep2,
        'm 119.26817,185.7818 c -6.46353,-8.28527 -13.65685,-19.91502 -18.58403,-30.04555 L 95.5,145.07737 95.163997,113.53869 C 94.979196,96.192408 95.144022,66.1375 95.530277,46.75 L 96.23256,11.5 h 26.45111 26.4511 l -0.7229,2.25 c -7.10739,22.121395 -8.1439,56.016559 -2.48927,81.402519 3.85082,17.287941 11.21358,34.917561 20.76951,49.731171 2.44228,3.78603 4.07317,7.20669 3.6242,7.60148 -0.60184,0.5292 -34.30634,26.51596 -46.95709,36.20475 -0.74868,0.57338 -2.15484,-0.42618 -4.09105,-2.90812 z', 
        125, 
        120
      ),
      new CourtSection(
        7, 
        SectionType.LeftWing2,
        'm 213.4972,266.15734 c -30.00718,-15.45806 -60.26754,-39.5261 -82.39532,-65.53438 -5.1204,-6.01836 -6.03008,-7.59862 -4.93912,-8.5801 1.86854,-1.68104 45.0893,-35.02126 46.44136,-35.82457 0.62455,-0.37107 4.02865,2.69665 7.8373,7.06285 14.81752,16.98668 35.66534,32.71005 56.09394,42.3059 6.03055,2.83271 11.06743,5.23724 11.19306,5.34342 0.29072,0.2457 -18.70316,59.66424 -19.58045,61.25351 -0.44814,0.81183 -5.05301,-1.08239 -14.65077,-6.02663 z',
        190, 
        220
      ),
      new CourtSection(
        8, 
        SectionType.TopKey2,
        'm 286,289.4133 c -12.30121,-1.57662 -27.52176,-5.12777 -40.30063,-9.40266 -7.04332,-2.35619 -13.02083,-4.49877 -13.28336,-4.76129 -0.26252,-0.26252 3.969,-14.37602 9.40338,-31.36333 6.99306,-21.85959 10.28983,-30.84072 11.28065,-30.73102 0.76998,0.0852 7.47496,1.73642 14.89996,3.66927 18.52869,4.82333 30.51168,6.0423 52.93248,5.38455 19.22877,-0.56411 35.08666,-3.05149 48.1132,-7.54677 l 5.54568,-1.91373 9.87669,30.90347 c 5.94841,18.61218 9.50983,31.25141 8.95432,31.77827 -3.21791,3.05194 -35.23434,11.27459 -52.72359,13.54078 -12.67815,1.64279 -43.39486,1.89126 -54.69878,0.44246 z',
        315, 
        250
      ),
      new CourtSection(
        9, 
        SectionType.RightWing2,
        'm 388.57775,242.91194 c -5.37932,-16.83502 -9.39744,-30.96522 -8.92916,-31.40046 0.46827,-0.43524 4.22641,-2.25338 8.35141,-4.0403 22.7174,-9.84103 45.8307,-26.93428 61.04873,-45.14807 l 4.74317,-5.67688 24.57262,19.05134 c 21.98925,17.04844 24.46306,19.25607 23.53047,20.99864 -2.08039,3.88725 -29.64423,31.25687 -39.39499,39.1174 -14.10275,11.36888 -31.82484,22.74145 -47,30.16071 -7.15,3.4957 -13.93188,6.62377 -15.07084,6.95127 -1.92602,0.55382 -2.75479,-1.54504 -11.85141,-30.01365 z',
        430,
        220
      ),
      new CourtSection(
        10,
        SectionType.RightDeep2,
        'm 481.27818,172.6719 c -13.31281,-10.26955 -24.22155,-18.99537 -24.24165,-19.39072 -0.0201,-0.39535 1.98829,-3.84886 4.46306,-7.67448 16.22979,-25.08867 24.50708,-53.290523 24.49451,-83.456073 -0.007,-16.276289 -1.78694,-29.792059 -5.42412,-41.182362 -1.39945,-4.382546 -2.55019,-8.305765 -2.55721,-8.718265 -0.007,-0.4125 12.61882,-0.75 28.05744,-0.75 h 28.0702 l -0.66833,60.25 c -0.36759,33.1375 -1.01253,63.90612 -1.43322,68.37471 -0.64064,6.80495 -1.58635,9.84438 -5.82204,18.7114 -4.65472,9.74425 -16.67376,29.13838 -19.52348,31.50343 -0.8724,0.72403 -7.9644,-4.20606 -25.41516,-17.66764 z',
        500,
        120
      ),
      new CourtSection(
        11,
        SectionType.LeftShort2,
        'M 223.54791,193.91166 C 182.86294,169.02224 156.45492,131.45995 148.38411,87 c -1.37812,-7.591722 -1.79453,-14.696143 -1.72908,-29.5 0.0884,-19.999639 1.23958,-28.878672 5.25074,-40.5 l 1.72578,-5 45.27335,-0.260252 45.27335,-0.260251 -5.15206,5.760251 C 233.21015,23.742377 226.7673,36.053277 224.49801,45 c -5.23169,20.625999 -1.28504,43.018064 10.78082,61.16707 4.2095,6.33178 15.22815,17.89531 20.46686,21.47898 l 2.24569,1.53622 -12.20566,35.15886 c -6.71311,19.33738 -12.44867,35.13371 -12.74569,35.10296 -0.29702,-0.0307 -4.56847,-2.52034 -9.49212,-5.53243 z', 
        190,
        50
      ),
      new CourtSection(
        12,
        SectionType.CenterShort2,
        'm 294,217.90716 c -1.375,-0.24074 -6.775,-1.15611 -12,-2.03417 -10.49169,-1.76311 -33.06037,-8.79698 -40.10734,-12.50006 L 237.37696,201 249.43848,166.36508 261.5,131.73017 l 7.5,3.76615 c 27.90237,14.01125 63.21512,14.52492 90.83049,1.32123 l 8.0696,-3.85831 11.5702,33.52038 c 6.36361,18.43621 11.56108,33.8767 11.54995,34.3122 -0.0302,1.18017 -11.66684,6.18074 -22.33629,9.59847 -18.6738,5.98176 -27.24933,7.27241 -50.68395,7.62817 -11.825,0.17952 -22.625,0.12943 -24,-0.1113 z', 
        315,
        170
      ),
      new CourtSection(
        13, 
        SectionType.RightShort2,
        'M 383.63405,165.76278 C 377.22162,147.19325 372.00657,131.55 372.04505,131 c 0.0385,-0.55 3.00935,-3.25 6.60195,-6 17.93449,-13.7282 29.04317,-34.610126 30.10835,-56.597215 0.97543,-20.134443 -5.29156,-36.804444 -19.61051,-52.163292 l -4.43818,-4.760507 44.30143,0.260507 L 473.30951,12 l 1.89709,5.5 c 5.38976,15.625931 6.23226,21.477076 6.26356,43.5 0.0318,22.410646 -0.80299,28.65636 -6.1486,46 -3.99655,12.96663 -14.30878,32.77639 -23.20888,44.58417 -13.20842,17.52361 -32.14297,34.08417 -51.21617,44.79474 -5.6035,3.14664 z',
        435, 
        50
      ),
      new CourtSection(
        14,
        SectionType.Layup,
        'M 297.89434,141.01053 C 278.32439,137.29527 262.02189,128.74281 248.48696,115.09092 233.45165,99.925696 226.53282,83.790702 226.57871,64 c 0.043,-18.537691 5.44517,-32.881862 17.14145,-45.514925 L 250.18727,11.5 h 64.28524 64.28523 l 6.53059,6.922765 C 397.95761,31.852874 403.92048,44.931136 404.70088,61 c 0.8519,17.541139 -3.95955,32.328844 -15.37707,47.26053 -10.73345,14.03706 -30.31717,26.4645 -49.32381,31.29992 -11.03843,2.80825 -31.27969,3.50534 -42.10566,1.45008 z', 
        315,
        70
      ),
      new CourtSection(
        15,
        SectionType.FreeThrow,
        '', // No path needed since it's not a visible court section
        540,
        440
      )
    ];
  }
}