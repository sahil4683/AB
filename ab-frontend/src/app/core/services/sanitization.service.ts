import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Input Sanitization Service
 * Provides secure methods for sanitizing user input to prevent XSS attacks
 */
@Injectable({
  providedIn: 'root',
})
export class SanitizationService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitize HTML content
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) || '';
  }

  /**
   * Sanitize resource URL
   */
  sanitizeResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.sanitize(4, url) || '';
  }

  /**
   * Sanitize plain text (basic XSS prevention)
   */
  sanitizeText(text: string): string {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\s()]{7,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove special characters from string
   */
  removeSpecialCharacters(text: string, allowedChars = ''): string {
    const regex = new RegExp(`[^a-zA-Z0-9${allowedChars}]`, 'g');
    return text.replace(regex, '');
  }

  /**
   * Trim whitespace and limit string length
   */
  sanitizeInput(input: string, maxLength = 255): string {
    return input.trim().substring(0, maxLength);
  }
}
