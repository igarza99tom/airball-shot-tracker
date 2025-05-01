import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-shot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-shot.component.html',
  styleUrl: './new-shot.component.scss'
})
export class NewShotComponent {
  @ViewChild('swipeCard') swipeCard?: ElementRef;
  
  isDragging = false;
  startX = 0;
  currentX = 0;
  
  // Mock data
  selectedSection = {
    id: 3,
    name: 'Top of Key 3'
  };
  
  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.getEventX(event);
    this.currentX = this.startX;
    
    if (this.swipeCard) {
      this.swipeCard.nativeElement.style.transition = 'none';
    }
    
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('touchmove', this.drag, { passive: false });
    document.addEventListener('mouseup', this.endDrag);
    document.addEventListener('touchend', this.endDrag);
  }
  
  drag = (event: MouseEvent | TouchEvent) => {
    if (!this.isDragging) return;
    
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
    
    this.currentX = this.getEventX(event);
    const deltaX = this.currentX - this.startX;
    
    if (this.swipeCard) {
      this.swipeCard.nativeElement.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      
      // Change overlay opacity based on swipe direction
      if (deltaX > 0) {
        this.swipeCard.nativeElement.classList.add('swiping-right');
        this.swipeCard.nativeElement.classList.remove('swiping-left');
      } else if (deltaX < 0) {
        this.swipeCard.nativeElement.classList.add('swiping-left');
        this.swipeCard.nativeElement.classList.remove('swiping-right');
      }
    }
  }
  
  endDrag = () => {
    if (!this.isDragging) return;
    
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('mouseup', this.endDrag);
    document.removeEventListener('touchend', this.endDrag);
    
    const deltaX = this.currentX - this.startX;
    
    if (this.swipeCard) {
      this.swipeCard.nativeElement.style.transition = 'transform 0.3s ease';
      
      // If swiped far enough, record the shot
      if (Math.abs(deltaX) > 100) {
        const isMake = deltaX > 0;
        this.recordShot(isMake);
        this.swipeCard.nativeElement.style.transform = `translateX(${isMake ? 1000 : -1000}px) rotate(${deltaX * 0.1}deg)`;
        
        // Reset card after animation
        setTimeout(() => {
          if (this.swipeCard) {
            this.swipeCard.nativeElement.style.transition = 'none';
            this.swipeCard.nativeElement.style.transform = '';
            this.swipeCard.nativeElement.classList.remove('swiping-right', 'swiping-left');
            setTimeout(() => {
              if (this.swipeCard) {
                this.swipeCard.nativeElement.style.transition = 'transform 0.3s ease';
              }
            }, 50);
          }
        }, 300);
      } else {
        // Not swiped far enough, return to center
        this.swipeCard.nativeElement.style.transform = '';
        this.swipeCard.nativeElement.classList.remove('swiping-right', 'swiping-left');
      }
    }
    
    this.isDragging = false;
  }
  
  private getEventX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent 
      ? event.clientX 
      : event.touches[0].clientX;
  }
  
  private recordShot(isMake: boolean) {
    console.log(`Shot ${isMake ? 'MADE' : 'MISSED'} from ${this.selectedSection.name}`);
  }
}