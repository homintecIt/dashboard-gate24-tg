interface RolePermission {
  roleId: number;
  menus: {
    menuId: number;
    actions: number[];
  }[];
}
