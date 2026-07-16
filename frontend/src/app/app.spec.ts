import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { Map as LeafletMap } from 'leaflet';
import { LEAFLET, LeafletStatic } from './map/leaflet.token';
import { App } from './app';

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

  it('should render the map panel', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.map-panel')).toBeTruthy();
  });

  it('should render the info panel', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.info-panel')).toBeTruthy();
  });
});
