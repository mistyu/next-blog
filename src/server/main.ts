import { swaggerUI } from '@hono/swagger-ui';
import { apiReference } from '@scalar/hono-api-reference';
import { openAPISpecs } from 'hono-openapi';

import { appConfig } from '@/config/app';

import { authPath, authRoutes } from './auth/routes';
import { createHonoApp } from './common/app';
import { postPath, postRoutes } from './post/routes';
const app = createHonoApp().basePath(appConfig.apiPath);
app.get('/', (c) => c.text('3R Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
app.route(postPath, postRoutes).route(authPath, authRoutes);

app.get(
  '/data',
  openAPISpecs(app, {
    documentation: {
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      info: {
        version: 'v1',
        title: 'Toome API',
        description: '3R TS全栈课程项目 - Toome的后端API',
      },
    },
  }),
);

app.get('/swagger', swaggerUI({ url: '/api/data' }));

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    url: '/api/data',
  }),
);
export { app };
