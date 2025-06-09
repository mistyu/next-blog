/* eslint-disable unused-imports/no-unused-vars */
import { prettyJSON } from 'hono/pretty-json';

import { createHonoApp } from './common/utils';
import { postApi } from './post/api';

const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('3R Blog API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));
const routes = app.route('/posts', postApi);
type AppType = typeof routes;
// const client = hc<AppType>(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
export { app, type AppType };
