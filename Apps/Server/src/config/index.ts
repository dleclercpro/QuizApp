import { Level } from 'pino';
import { loadEnvironment } from '../utils/env';
import { parseNumberText } from '../utils/string';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types';
import { PACKAGE_NAME } from '../constants';

export const ENV = loadEnvironment();
export const LOGGING_LEVEL = (process.env.LOGGING_LEVEL ?? 'trace') as Level;

export const HOST = process.env.HOST!;
export const PORT = parseNumberText(process.env.PORT);

export const API_VERSION = 1;
export const API_ROOT = `/api/v${API_VERSION}`;

export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = parseNumberText(process.env.DB_PORT);
export const DB_NAME = PACKAGE_NAME;

export const DB_RETRY_CONNECT_MAX_DELAY = new TimeDuration(3, TimeUnit.Seconds);
export const DB_RETRY_CONNECT_TIMEOUT = new TimeDuration(5, TimeUnit.Seconds);
export const DB_RETRY_CONNECT_MAX = 5;

export const N_SALT_ROUNDS = 10;

export const N_QUIZ_QUESTIONS = 20;