import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import type { Collision } from '../collision.types';

@Component({
  selector: 'app-collision-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './collision-info.html',
})
export class CollisionInfoComponent {
  @Input() collision: Collision | null = null;
}
