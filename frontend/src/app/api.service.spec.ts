import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import type { Collision } from './collision.types';

const COLLISION_STUB: Collision = {
  collisionId: 2202633,
  reportNumber: '9680-2023-02956',
  fileType: 'R',
  district: 11,
  county: 'SE',
  ir: 1,
  hwyRelated: true,
  locationComplete: null,
  updateDate: '2025-03-24',
  comment: 'test comment',
  additionalPartyCount: 0,
  soeComplete: null,
  parties: [],
};

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCollision()', () => {
    it('sends GET to /api/collision/:id and emits the response', () => {
      let result: Collision | undefined;

      service.getCollision('2202633').subscribe(c => (result = c));

      const req = httpMock.expectOne('http://localhost:3000/api/collision/2202633');
      expect(req.request.method).toBe('GET');
      req.flush(COLLISION_STUB);

      expect(result).toEqual(COLLISION_STUB);
    });
  });
});
