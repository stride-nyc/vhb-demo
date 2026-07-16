import { TestBed, ComponentFixture } from '@angular/core/testing';
import type { Map as LeafletMap, TileLayer } from 'leaflet';
import { MapComponent } from './map';
import { LEAFLET, LeafletStatic } from './leaflet.token';

function makeLeafletMock(): {
  L: LeafletStatic;
  map: jasmine.SpyObj<LeafletMap>;
  tileLayer: jasmine.SpyObj<TileLayer>;
} {
  const map = jasmine.createSpyObj<LeafletMap>('Map', ['setView', 'remove']);
  map.setView.and.returnValue(map);
  const tileLayer = jasmine.createSpyObj<TileLayer>('TileLayer', ['addTo']);

  const L = {
    map: jasmine.createSpy('map').and.returnValue(map),
    tileLayer: jasmine.createSpy('tileLayer').and.returnValue(tileLayer),
  } as unknown as LeafletStatic;

  return { L, map, tileLayer };
}

describe('MapComponent', () => {
  let fixture: ComponentFixture<MapComponent>;
  let component: MapComponent;
  let mocks: ReturnType<typeof makeLeafletMock>;

  beforeEach(async () => {
    mocks = makeLeafletMock();

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: LEAFLET, useValue: mocks.L }],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a map container element', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.map-container')).toBeTruthy();
  });

  it('should initialize Leaflet map in the container div', () => {
    fixture.detectChanges();
    expect(mocks.L.map).toHaveBeenCalledOnceWith(jasmine.any(HTMLDivElement));
  });

  it('should center the map on California at zoom 6', () => {
    fixture.detectChanges();
    expect(mocks.map.setView).toHaveBeenCalledOnceWith([36.7783, -119.4179], 6);
  });

  it('should add an OpenStreetMap tile layer with maxZoom 19', () => {
    fixture.detectChanges();
    expect(mocks.L.tileLayer).toHaveBeenCalledOnceWith(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      jasmine.objectContaining({ maxZoom: 19 }),
    );
  });

  it('should attach the tile layer to the map', () => {
    fixture.detectChanges();
    expect(mocks.tileLayer.addTo).toHaveBeenCalledOnceWith(mocks.map);
  });

  it('should remove the map when the component is destroyed', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mocks.map.remove).toHaveBeenCalledTimes(1);
  });
});
