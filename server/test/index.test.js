process.env.NODE_ENV = 'test';
process.env.MOCK_RESPONSE = 'test-reply';
import request from 'supertest';
import { app } from '../index.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('chat endpoint returns mock response', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({ messages: [{ role: 'user', content: 'hi' }] });
  assert.equal(res.status, 200);
  assert.equal(res.body.choices[0].message.content, 'test-reply');
});
