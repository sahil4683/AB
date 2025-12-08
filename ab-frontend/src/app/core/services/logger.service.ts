import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Professional logging service for the application
 * Provides structured logging with different log levels
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private currentLogLevel: LogLevel;

  constructor() {
    this.currentLogLevel = this.parseLogLevel(environment.logLevel);
  }

  /**
   * Log debug level message
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info level message
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning level message
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error level message
   */
  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = this.getFormattedTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data);
        break;
    }
  }

  /**
   * Check if message should be logged based on log level
   */
  private shouldLog(level: LogLevel): boolean {
    const levelMap: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };

    return levelMap[level] >= levelMap[this.currentLogLevel];
  }

  /**
   * Parse log level string to enum
   */
  private parseLogLevel(levelStr: string): LogLevel {
    const level = levelStr.toUpperCase() as LogLevel;
    return Object.values(LogLevel).includes(level) ? level : LogLevel.INFO;
  }

  /**
   * Get formatted timestamp
   */
  private getFormattedTimestamp(): string {
    return new Date().toISOString();
  }
}
