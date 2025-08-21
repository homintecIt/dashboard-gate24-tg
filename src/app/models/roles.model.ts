import { Menus } from "./menus.model";

export class Roles {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  name?: string;
  menus?: Menus [];
}
