import chalk from 'chalk';
import { isNil } from 'lodash';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { loadFileEnvs } from '@/libs/env';

import { generateFormattedSecret } from './server/auth/secret';

const { file, envs = {} } = loadFileEnvs();
let envPath = file;
if (isNil(envPath)) envPath = resolve(__dirname, '..', '.env');

if (!isNil(envs?.AUTH_JWT_SECRET)) {
  console.log(chalk.green('The app key already exists and does not need to be generated!'));
} else {
  envs.AUTH_JWT_SECRET = generateFormattedSecret();
  console.log(chalk.green('App key generated successfully!'));
}
const newEnvContent = Object.entries(envs)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

writeFileSync(envPath, newEnvContent);

process.exit();
