import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  const requiredRole = route.data['role'];
  if (!requiredRole) {
    return false;
  }

  if (authenticated && hasRequiredRole(requiredRole, grantedRoles.resourceRoles)) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/unauthorised');
};

function hasRequiredRole(requiredRole: string[], grantedRoles: Record<string, string[]>): boolean {
  const allGranted: string[] = Object.values(grantedRoles).flat();
  return requiredRole.every((role: string) => allGranted.includes(role));
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);