import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-coding-comment-button',
  standalone: true,
  imports: [],
  templateUrl: './coding-comment-button.html',
  styleUrl: './coding-comment-button.scss',
})
export class CodingCommentButtonComponent {
  @Input() collisionId: string = '';
  @Input() comment: string = '';
  @Output() commentSaved = new EventEmitter<string>();
}
