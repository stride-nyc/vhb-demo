import request from 'supertest';
import app from '../app';

describe('GET /api/collision/:id', () => {
  it('returns 404 for an unknown collision id', async () => {
    const res = await request(app).get('/api/collision/9999');
    expect(res.status).toBe(404);
  });

  it('returns 200 with collision data for the known collision', async () => {
    const res = await request(app).get('/api/collision/2202633');
    expect(res.status).toBe(200);
    expect(res.body.collisionId).toBe(2202633);
    expect(res.body.reportNumber).toBe('9680-2023-02956');
    expect(res.body.parties).toHaveLength(5);
  });
});
