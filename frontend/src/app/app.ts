import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MapComponent } from './map/map';
import { CollisionInfoComponent } from './collision-info/collision-info';
import { ApiService } from './api.service';
import type { Collision } from './collision.types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatGridListModule, CollisionInfoComponent, MapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private apiService = inject(ApiService);

  message = signal<string>('Loading...');
  health = signal<string>('Checking...');
  collision = signal<Collision | null>(null);

  onMarkerClicked(id: string): void {
    this.apiService.getCollision(id).subscribe({
      next: (res) => this.collision.set(res),
    });
  }

  ngOnInit(): void {
    this.apiService.getHello().subscribe({
      next: (res) => this.message.set(res.message),
      error: () => this.message.set('Could not reach backend.')
    });
    this.apiService.getHealth().subscribe({
      next: (res) => this.health.set(`Status: ${res.status} — ${res.timestamp}`),
      error: () => this.health.set('Backend offline.')
    });
  }
}