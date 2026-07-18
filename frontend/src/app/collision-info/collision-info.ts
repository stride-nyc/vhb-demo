import { Component, Input } from '@angular/core';
import type { Collision } from '../collision.types';

@Component({
  selector: 'app-collision-info',
  standalone: true,
  imports: [],
  templateUrl: './collision-info.html',
  styleUrl: './collision-info.scss',
})
export class CollisionInfoComponent {
  @Input() collision: Collision | null = null;
}
