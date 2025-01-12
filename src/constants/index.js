import path from 'node:path';
import { getEnvVar } from '../utils/getEnvVar.js';

export const SMTP = {
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: getEnvVar('SMTP_PORT'),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASSWORD: getEnvVar('SMTP_PASSWORD'),
  SMTP_FROM: getEnvVar('SMTP_FROM'),
};
export const TEMPLATES_DIR = path.resolve('src', 'templates');
