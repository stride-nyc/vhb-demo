import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import type { Map as LeafletMap } from 'leaflet';
import { LEAFLET, LeafletStatic } from './map/leaflet.token';
import { ApiService } from './api.service';
import type { Collision } from './collision.types';
import { App } from './app';
import { MapComponent } from './map/map';

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
  const marker = jasmine.createSpyObj('Marker', ['addTo', 'on']);
  marker.addTo.and.returnValue(marker);
  marker.on.and.returnValue(marker);
  return {
    map: jasmine.createSpy('map').and.returnValue(map),
    tileLayer: jasmine.createSpy('tileLayer').and.returnValue(
      jasmine.createSpyObj('TileLayer', ['addTo']),
    ),
    marker: jasmine.createSpy('marker').and.returnValue(marker),
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


});

describe('App — initialization behavior', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj<ApiService>('ApiService', [
      'getHello', 'getHealth', 'getCollision',
    ]);
    apiService.getHello.and.returnValue(of({ message: 'ok' }));
    apiService.getHealth.and.returnValue(of({ status: 'ok', timestamp: '2024-01-01' }));
    apiService.getCollision.and.returnValue(of(COLLISION_STUB));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ApiService, useValue: apiService },
        { provide: LEAFLET, useValue: makeLeafletMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call getCollision during initialization', () => {
    expect(apiService.getCollision).not.toHaveBeenCalled();
  });

  it('should not render the collision info card when no collision is loaded', () => {
    expect(fixture.nativeElement.querySelector('app-collision-info')).toBeNull();
  });

  it('should call getCollision with the marker ID when onMarkerClicked fires', () => {
    component.onMarkerClicked('2202633');
    expect(apiService.getCollision).toHaveBeenCalledOnceWith('2202633');
  });

  it('should fetch collision when the map emits markerClicked', () => {
    const mapEl = fixture.debugElement.query(By.directive(MapComponent));
    mapEl.componentInstance.markerClicked.emit('2202633');
    expect(apiService.getCollision).toHaveBeenCalledOnceWith('2202633');
  });

});
