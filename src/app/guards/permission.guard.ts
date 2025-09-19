import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { PermissionService } from "../services/permission.service";

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const menuName = route.data['menu'];
    return this.permissionService.hasPermission(menuName, "consulter");
  }
}
