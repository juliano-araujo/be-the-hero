const request = require('supertest');

const app = require('../../src/app');
const db = require('../../src/database');

describe('ONG', () => {
  
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback(null, true);
  })

  afterAll(async () => {
    await db.destroy();
  })

  it('should be able to create a new ONG', async () => {
     const response = await request(app)
      .post('/ongs')
      .send({
        name: 'Vira-Lata Vira-Amor',
        email: 'contato@viralataviraamor.com.br',
        whatsapp: '69999990003',
        city: 'Cacoal',
        uf: 'RO'
      });

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toHaveLength(8);
  })
})