import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '../services/logger.service';

/**
 * Admin Guard
 * Protects admin routes and ensures only authorized users can access them
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(
    private router: Router,
    private logger: LoggerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // TODO: Implement proper authentication logic
    // This is a placeholder implementation
    const isAdmin = this.checkAdminAccess();

    if (!isAdmin) {
      this.logger.warn('Unauthorized access attempt to admin panel');
      this.router.navigate(['/']);
      return false;
    }

    this.logger.info('Admin access granted');
    return true;
  }

  /**
   * Check if user has admin access
   * Replace this with actual authentication logic
   */
  private checkAdminAccess(): boolean {
    // TODO: Implement actual authentication check
    // For now, allow access (set to true for development)
    return true;
  }
}

/**
 * Admin Guard Function (Functional approach)
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const guard = new AdminGuard(
    (route.component as any)?.injector?.get(Router),
    (route.component as any)?.injector?.get(LoggerService)
  );
  return guard.canActivate(route, state);
};
