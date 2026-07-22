import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Collision } from '../collision.types';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-collision-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './collision-info.html',
  styleUrl: './collision-info.scss',
})
export class CollisionInfoComponent {
  @Input() collision: Collision | null = null;

  private api = inject(ApiService);

  dialogOpen = false;
  draftComment = '';

  get hasComment(): boolean {
    return !!(this.collision?.codingComment);
  }

  openDialog(): void {
    this.draftComment = this.collision?.codingComment ?? '';
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.draftComment = '';
  }

  saveComment(): void {
    if (!this.collision) return;
    this.api.saveCodingComment(String(this.collision.collisionId), this.draftComment).subscribe({
      next: ({ codingComment }) => {
        this.collision!.codingComment = codingComment;
        this.dialogOpen = false;
      },
    });
  }
}
