'use strict';
import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDirPath = path.normalize(`${process.cwd()}/logs`);
// Create the log directory if it does not exist
try {
  if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
  }
} catch (e) {
  throw new Error(e.message);
}

const { label, timestamp, json, printf, combine, colorize, errors } = format;
const logger = createLogger({
  transports: [
    new DailyRotateFile({
      level: 'info', // info and below to rotate
      filename: `${logDirPath}/%DATE%-access.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '20m',
      maxSize: '14d',
      json: true,
      zippedArchive: true,
      format: combine(
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    new DailyRotateFile({
      level: 'error', // error and below to rotate
      filename: `${logDirPath}/%DATE%-errors.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '20m',
      maxSize: '14d',
      json: true,
      zippedArchive: true,
      format: combine(
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: combine(
        colorize(),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
  ],

  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errors({
      stack: true,
    }),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  exitOnError: false, // do not exit on handled exceptions
});

export default logger;
