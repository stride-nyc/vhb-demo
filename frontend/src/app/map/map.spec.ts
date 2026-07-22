import { TestBed, ComponentFixture } from '@angular/core/testing';
import type { Map as LeafletMap, TileLayer, Marker } from 'leaflet';
import { MapComponent } from './map';
import { LEAFLET, LeafletStatic } from './leaflet.token';

function makeLeafletMock(): {
  L: LeafletStatic;
  map: jasmine.SpyObj<LeafletMap>;
  tileLayer: jasmine.SpyObj<TileLayer>;
  marker: jasmine.SpyObj<Marker>;
} {
  const map = jasmine.createSpyObj<LeafletMap>('Map', ['setView', 'remove']);
  map.setView.and.returnValue(map);
  const tileLayer = jasmine.createSpyObj<TileLayer>('TileLayer', ['addTo']);
  const marker = jasmine.createSpyObj<Marker>('Marker', ['addTo', 'on']);
  marker.addTo.and.returnValue(marker);
  marker.on.and.returnValue(marker);

  const L = {
    map: jasmine.createSpy('map').and.returnValue(map),
    tileLayer: jasmine.createSpy('tileLayer').and.returnValue(tileLayer),
    marker: jasmine.createSpy('marker').and.returnValue(marker),
    Icon: {
      Default: {
        prototype: {} as Record<string, unknown>,
        mergeOptions: jasmine.createSpy('mergeOptions'),
      },
    },
  } as unknown as LeafletStatic;

  return { L, map, tileLayer, marker };
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

  it('should create a marker at the Los Angeles coordinates', () => {
    fixture.detectChanges();
    expect(mocks.L.marker).toHaveBeenCalledOnceWith([34.0522, -118.2437]);
  });

  it('should attach the marker to the map', () => {
    fixture.detectChanges();
    expect(mocks.marker.addTo).toHaveBeenCalledOnceWith(mocks.map);
  });

  it('should emit markerClicked with the collision ID when the marker is clicked', () => {
    const emitted: string[] = [];
    component.markerClicked.subscribe((id: string) => emitted.push(id));

    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onArgs: any[] = mocks.marker.on.calls.mostRecent()?.args ?? [];
    const clickCb: ((e: unknown) => void) | undefined = onArgs[1];
    clickCb?.({});

    expect(emitted).toEqual(['2202633']);
  });
});
