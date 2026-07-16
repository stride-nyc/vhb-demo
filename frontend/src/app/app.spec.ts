import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import type { Map as LeafletMap } from 'leaflet';
import { LEAFLET, LeafletStatic } from './map/leaflet.token';
import { ApiService } from './api.service';
import type { Collision } from './collision.types';
import { App } from './app';

function makePartyStub(party: number, partyType: string) {
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
  parties: [makePartyStub(1, 'DRIVER'), makePartyStub(2, 'PEDESTRIAN')],
};

function makeLeafletMock(): LeafletStatic {
  const map = jasmine.createSpyObj<LeafletMap>('Map', ['setView', 'remove']);
  map.setView.and.returnValue(map);
  return {
    map: jasmine.createSpy('map').and.returnValue(map),
    tileLayer: jasmine.createSpy('tileLayer').and.returnValue(
      jasmine.createSpyObj('TileLayer', ['addTo']),
    ),
  } as unknown as LeafletStatic;
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LEAFLET, useValue: makeLeafletMock() },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Material toolbar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-toolbar')).toBeTruthy();
  });

  it('should render two grid tiles', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('mat-grid-tile').length).toBe(2);
  });

  it('should render the info panel inside the first tile', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-grid-tile .info-panel')).toBeTruthy();
  });

  it('should render the map inside the second tile', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-grid-tile app-map')).toBeTruthy();
  });

  it('should render "Collision Information" card title in the left grid tile', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const leftTile = el.querySelector('mat-grid-tile');
    expect(leftTile).withContext('left grid tile not found').toBeTruthy();
    expect(leftTile!.textContent).toContain('Collision Information');
  });

  it('should display collision ID in the left grid tile after data loads', () => {
    const apiService = TestBed.inject(ApiService);
    const spy = spyOn(apiService, 'getCollision').and.returnValue(of(COLLISION_STUB));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledOnceWith('2202633');
    const leftTile: HTMLElement | null = fixture.nativeElement.querySelector('mat-grid-tile');
    expect(leftTile).withContext('left grid tile not found').toBeTruthy();
    expect(leftTile!.textContent).toContain('2202633');
  });

  it('should display all collision fields and party rows in the left grid tile', () => {
    const apiService = TestBed.inject(ApiService);
    spyOn(apiService, 'getCollision').and.returnValue(of(COLLISION_STUB));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const leftTile: HTMLElement | null = fixture.nativeElement.querySelector('mat-grid-tile');
    expect(leftTile).withContext('left grid tile not found').toBeTruthy();
    const text = leftTile!.textContent ?? '';
    expect(text).withContext('reportNumber').toContain('9680-2023-02956');
    expect(text).withContext('county').toContain('MARIN');
    expect(text).withContext('updateDate').toContain('2025-03-24');
    expect(text).withContext('comment').toContain('test comment');
    expect(text).withContext('party DRIVER').toContain('DRIVER');
    expect(text).withContext('party PEDESTRIAN').toContain('PEDESTRIAN');
  });
});
