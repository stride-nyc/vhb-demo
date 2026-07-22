import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-coding-comment-button',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './coding-comment-button.html',
  styleUrl: './coding-comment-button.scss',
})
export class CodingCommentButtonComponent {
  @Input() collisionId: string = '';
  @Input() comment: string = '';
  @Output() commentSaved = new EventEmitter<string>();

  private api = inject(ApiService);

  dialogOpen = false;
  draftComment = '';

  openDialog(): void {
    this.draftComment = this.comment;
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.draftComment = '';
  }

  saveComment(): void {
    this.api.saveComment(this.collisionId, this.draftComment).subscribe({
      next: ({ comment }) => {
        this.commentSaved.emit(comment);
        this.dialogOpen = false;
      },
    });
  }
}
