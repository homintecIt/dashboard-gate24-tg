export class Menus {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  name?: string;
  path?: number;
  actions? :number[]
  ///selected?: boolean;
}
export interface MenusWithSelected extends Menus {
  selected: boolean; // Ajout de la propriété `selected`
}
