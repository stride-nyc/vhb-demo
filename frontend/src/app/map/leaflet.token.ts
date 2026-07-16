import { InjectionToken } from '@angular/core';
import * as L from 'leaflet';

export type LeafletStatic = typeof L;

export const LEAFLET = new InjectionToken<LeafletStatic>('Leaflet', {
  providedIn: 'root',
  factory: () => L,
});
