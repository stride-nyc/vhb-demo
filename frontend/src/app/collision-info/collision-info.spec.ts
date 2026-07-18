import { TestBed, ComponentFixture } from '@angular/core/testing';
import type { Collision, Party } from '../collision.types';
import { CollisionInfoComponent } from './collision-info';

function makeParty(party: number, partyType: string): Party {
  return {
    party,
    primaryObject: 'VEH',
    primaryObjectLoc: null,
    other1Object: null,
    other1Loc: null,
    other2Object: null,
    other2Loc: null,
    other3Object: null,
    other3Loc: null,
    vehHwyIndicator: 1,
    partyType,
    movement: 'STRAIGHT',
    direction: 'N',
    ccuMvmt: null,
    ccuDir: null,
  };
}

const COLLISION_STUB: Collision = {
  collisionId: 2202633,
  reportNumber: '9680-2023-02956',
  fileType: 'R',
  district: 11,
  county: 'MARIN',
  ir: 1,
  hwyRelated: true,
  locationComplete: null,
  updateDate: '2025-03-24',
  comment: 'test comment',
  additionalPartyCount: 0,
  soeComplete: null,
  parties: [makeParty(1, 'DRIVER'), makeParty(2, 'PEDESTRIAN')],
};

describe('CollisionInfoComponent', () => {
  let fixture: ComponentFixture<CollisionInfoComponent>;
  let component: CollisionInfoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollisionInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollisionInfoComponent);
    component = fixture.componentInstance;
  });

  it('should render the crash record header when a collision is provided', () => {
    component.collision = COLLISION_STUB;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Crash Record');
  });

  it('should render the collision ID when a collision is provided', () => {
    component.collision = COLLISION_STUB;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('2202633');
  });

  it('should render all collision fields and party rows when a collision is provided', () => {
    component.collision = COLLISION_STUB;
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).withContext('reportNumber').toContain('9680-2023-02956');
    expect(text).withContext('county').toContain('MARIN');
    expect(text).withContext('updateDate').toContain('2025-03-24');
expect(text).withContext('party DRIVER').toContain('DRIVER');
    expect(text).withContext('party PEDESTRIAN').toContain('PEDESTRIAN');
  });
});
