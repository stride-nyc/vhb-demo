import { Component, Input } from '@angular/core';
import type { Collision } from '../collision.types';
import { CodingCommentButtonComponent } from '../coding-comment-button/coding-comment-button';

@Component({
  selector: 'app-collision-info',
  standalone: true,
  imports: [CodingCommentButtonComponent],
  templateUrl: './collision-info.html',
  styleUrl: './collision-info.scss',
})
export class CollisionInfoComponent {
  @Input() collision: Collision | null = null;

  onCommentSaved(comment: string): void {
    if (this.collision) {
      this.collision.comment = comment;
    }
  }
}
