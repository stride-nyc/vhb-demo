import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CodingCommentButtonComponent } from './coding-comment-button';

describe('CodingCommentButtonComponent', () => {
  let fixture: ComponentFixture<CodingCommentButtonComponent>;
  let component: CodingCommentButtonComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingCommentButtonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingCommentButtonComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

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

  describe('dialog', () => {
    it('openDialog() sets draftComment to the current comment input', () => {
      component.comment = 'existing note';
      component.openDialog();
      expect(component.draftComment).toBe('existing note');
    });

    it('closeDialog() resets dialogOpen and draftComment without emitting commentSaved', () => {
      const emitted: string[] = [];
      component.commentSaved.subscribe((v: string) => emitted.push(v));
      component.comment = 'a note';
      component.openDialog();
      component.closeDialog();
      expect(component.dialogOpen).toBeFalse();
      expect(component.draftComment).toBe('');
      expect(emitted).toEqual([]);
    });

    it('saveComment() calls ApiService with collisionId and draftComment, emits commentSaved, and closes', () => {
      const emitted: string[] = [];
      component.commentSaved.subscribe((v: string) => emitted.push(v));
      component.collisionId = '2202633';
      component.comment = 'old note';
      component.openDialog();
      component.draftComment = 'new note';

      component.saveComment();

      const req = httpMock.expectOne('http://localhost:3000/api/collision/2202633/comment');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ comment: 'new note' });
      req.flush({ comment: 'new note' });

      expect(emitted).toEqual(['new note']);
      expect(component.dialogOpen).toBeFalse();
    });
  });
});
