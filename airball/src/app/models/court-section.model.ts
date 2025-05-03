export enum SectionType {
    LeftCorner3 = 'Left Corner 3',
    LeftWing3 = 'Left Wing 3',
    TopKey3 = 'Top of Key 3',
    RightWing3 = 'Right Wing 3',
    RightCorner3 = 'Right Corner 3',
    LeftDeep2 = 'Left Deep 2',
    LeftWing2 = 'Left Wing 2',
    TopKey2 = 'Top Key 2',
    RightWing2 = 'Right Wing 2',
    RightDeep2 = 'Right Deep 2',
    LeftShort2 = 'Left Short 2',
    CenterShort2 = 'Center Short 2',
    RightShort2 = 'Right Short 2',
    Layup = 'Layup'
  }
  
  export class CourtSection {
    id: number;
    type: SectionType;
    make: number = 0;
    total: number = 0; 
    path: string;
    labelX: number;
    labelY: number;
    
    constructor(id: number, type: SectionType, path: string, labelX: number, labelY: number) {
      this.id = id;
      this.type = type;
      this.path = path;
      this.labelX = labelX;
      this.labelY = labelY;
    }
  
    get name(): string {
      return this.type;
    }
  
    get miss(): number {
      return this.total - this.make;
    }
  
    get percentage(): number {
      return this.total > 0 ? Math.round((this.make / this.total) * 100) : 0;
    }
  }