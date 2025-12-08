import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

/**
 * HTTP Error Interceptor for global error handling
 * Catches all HTTP errors and provides consistent error handling
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => this.formatError(error));
      })
    );
  }

  /**
   * Handle and log HTTP errors
   */
  private handleError(error: HttpErrorResponse): void {
    const errorMessage = this.getErrorMessage(error);

    this.logger.error(`HTTP Error [${error.status}]`, {
      url: error.url,
      message: errorMessage,
      status: error.status,
    });
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return error.error.message;
    }

    // Server-side error
    switch (error.status) {
      case 0:
        return 'Network error. Please check your internet connection.';
      case 400:
        return error.error?.message || 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Forbidden. You do not have permission to access this resource.';
      case 404:
        return 'Resource not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `An error occurred: ${error.statusText || 'Unknown error'}`;
    }
  }

  /**
   * Format error for application consumption
   */
  private formatError(error: HttpErrorResponse): any {
    return {
      status: error.status,
      statusText: error.statusText,
      message: this.getErrorMessage(error),
      url: error.url,
      timestamp: new Date().toISOString(),
    };
  }
}
