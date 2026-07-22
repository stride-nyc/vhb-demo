import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Collision } from './collision.types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getHello(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/hello`);
  }

  getHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.baseUrl}/health`);
  }

  getCollision(id: string): Observable<Collision> {
    return this.http.get<Collision>(`${this.baseUrl}/collision/${id}`);
  }

  saveCodingComment(id: string, codingComment: string): Observable<{ codingComment: string }> {
    return this.http.patch<{ codingComment: string }>(
      `${this.baseUrl}/collision/${id}/coding-comment`,
      { codingComment },
    );
  }
}