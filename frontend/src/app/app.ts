import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private apiService = inject(ApiService);

  message = signal<string>('Loading...');
  health = signal<string>('Checking...');

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