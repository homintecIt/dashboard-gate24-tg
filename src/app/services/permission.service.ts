import { Injectable } from "@angular/core";
import { storageHelper } from "../misc/storage.misc";
import { userIdentifier } from "../misc/utilities.misc";

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: any[] = [];

setPermissions(permissions: any[]) {
  // Sauvegarde dans le local storage
  storageHelper.local.store(`${userIdentifier}`, permissions);

  // Garde la référence en mémoire
  this.permissions = permissions;
}

getPermissions(): any[] {
  const stored = storageHelper.local.get(`${userIdentifier}`);
  return stored ? stored : [];
}


  hasPermission(menuName: string, action: string): boolean {
    const perm = this.getPermissions().find(p => p.menu.name === menuName);
    return perm ? perm.actions.includes(action) : false;
  }

  getMenus(): any[] {
    return this.permissions.map(p => p.menu);
  }

 hasMenus(menuName: string): boolean {
  return this.permissions.some(p => p.menu.name === menuName);
}

}
