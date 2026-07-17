import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject, Output, EventEmitter } from '@angular/core';
import type { Map as LeafletMap } from 'leaflet';
import { LEAFLET } from './leaflet.token';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Output() markerClicked = new EventEmitter<string>();

  private L = inject(LEAFLET);
  private map!: LeafletMap;

  ngAfterViewInit(): void {
    this.map = this.L.map(this.mapContainer.nativeElement).setView([36.7783, -119.4179], 6);

    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.L.marker([34.0522, -118.2437])
      .addTo(this.map)
      .on('click', () => this.markerClicked.emit('2202633'));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}