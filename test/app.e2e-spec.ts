import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Get Graphql Schema (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.useLogger(console);
  });

  it('/ (GET)', async () => {
    const expectedPattern = {
      data: {
        __schema: {
          types: [
            { name: 'Boolean' },
            { name: 'CreateUserInput' },
            { name: 'DateTime' },
          ],
        },
      },
    };

    const req = await request(app.getHttpServer())
      .get('/graphql')
      .send({
        query: `
          query {
            __schema {
              types {
                name
              }
            }
          }
        `,
      }).expect(200);

    req.once('request', (request) => {
      console.log('Request headers:', request.header);
      console.log('Request body:', request._data);
    });
  });
});
