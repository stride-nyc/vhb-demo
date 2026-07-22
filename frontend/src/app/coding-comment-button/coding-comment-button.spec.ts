import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CodingCommentButtonComponent } from './coding-comment-button';

describe('CodingCommentButtonComponent', () => {
  let fixture: ComponentFixture<CodingCommentButtonComponent>;
  let component: CodingCommentButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingCommentButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingCommentButtonComponent);
    component = fixture.componentInstance;
  });

  it('renders a button with class comments-btn', () => {
    fixture.detectChanges();
    const btn: HTMLButtonElement | null = fixture.nativeElement.querySelector('button.comments-btn');
    expect(btn).not.toBeNull();
  });

  it('has comments-btn--has-comment class when comment is non-empty', () => {
    component.comment = 'a note';
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.comments-btn');
    expect(btn.classList.contains('comments-btn--has-comment')).toBeTrue();
  });

  it('does not have comments-btn--has-comment class when comment is empty', () => {
    component.comment = '';
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button.comments-btn');
    expect(btn.classList.contains('comments-btn--has-comment')).toBeFalse();
  });
});
