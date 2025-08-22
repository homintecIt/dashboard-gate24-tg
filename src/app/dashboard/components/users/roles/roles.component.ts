import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Menus, MenusWithSelected } from 'src/app/models/menus.model';
import { Roles } from 'src/app/models/roles.model';
import { ActionService } from 'src/app/services/action.service';
import { MenusService } from 'src/app/services/menus.service';
import { RolesService } from 'src/app/services/roles.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

interface MenuSelection {
  menuId: number;
  actions: number[];
}
interface RolePermission {
  roleId: number;
  menus: {
    menuId: number;
    actions: number[];
  }[];
}



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles!: Roles[];
  actions: any[] =[] ;

  rolesForm: FormGroup = new FormGroup({});
rolePermissions: RolePermission = {
  roleId: 1, // id du rôle à modifier
  menus: []
};

  submitted = false;
  loading = false;
  menus!: Menus[];
  selectedMenuIds: number[] = [];  // Tableau des IDs sélectionnés

  constructor(
    private router: Router,
    private actionService: ActionService,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private menusService: MenusService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getMenus();
    this.getActions();
    this.rolesForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      menuIds: this.formBuilder.array([]),
      actionIds: this.formBuilder.array([]),

    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.rolesForm.controls;
  }
formatActionName(text: string): string {
  let result = text
    .replace(/_/g, ' ')                  // snake_case
    .replace(/-/g, ' ')                  // kebab-case
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase
    .toLowerCase();

  // Traductions spécifiques
  result = result
    .replace(/\bupdate\b/g, 'modifier')
    .replace(/\bdelete\b/g, 'supprimer')
    .replace(/\badd\b/g, 'ajouter');

  return result;
}
// Getter pour accéder au FormArray plus facilement
get menuIdsFormArray() {
  return this.rolesForm.get('menuIds') as FormArray;
}


get actionIdsFormArray(): FormArray {
  return this.rolesForm.get('actionIds') as FormArray;
}



  onCheckboxChange(event: any, menuId: number) {
    if (event.target.checked) {
      // Ajouter l'ID si la case est cochée
      this.selectedMenuIds.push(menuId);
    } else {
      // Retirer l'ID si la case est décochée
      const index = this.selectedMenuIds.indexOf(menuId);
      if (index > -1) {
        this.selectedMenuIds.splice(index, 1);
      }
    }
  }


  get menusFormArray(): FormArray {
    return this.rolesForm.get('menus') as FormArray;
  }


  getMenus() {
    this.menusService.getMenus().subscribe({
      next: (data: any) => {
        // Vérifiez si data est défini avant d'appeler map()
        if (data && Array.isArray(data)) {
          this.menus = data.map((menu: any) => ({ ...menu, selected: false }));
        } else {
          console.error('Les menus sont vides ou invalides');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des menus', error);
      }
    });
  }


  getRoles() {
    this.rolesService.getRoles().subscribe({
      next: (data: any) => {
        this.roles = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des rôles', error);
      }
    });
  }



  getActions() {
    this.actionService.getActions().subscribe({
      next: (data: any) => {
        this.actions = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des rôles', error);
      }
    });
  }


  addroles() {
    this.submitted = true;
    if (this.rolesForm.invalid) {
      return;
    }

    this.loading = true;

    // Filtrer les menus sélectionnés et extraire leurs ID
     // Récupérer les ID des menus sélectionnés

     const formValues = this.rolesForm.value;

    const bodyFormData = {
      name: this.rolesForm.value.name,
      menuIds: this.selectedMenuIds
    };
    this.rolesService.addRoles(bodyFormData).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.getRoles();
        this.sweetAlertService.toastSuccess('Rôle ajouté !', 3000);
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError('Erreur d\'enregistrement !', 3000);
      }
    });
  }



  submit() {
/*     const payload = {
      roleId: this.roleId,
      menus: this.menus
        .filter(menu => menu.selected)
        .map(menu => ({
          menuId: menu.id,
          actions: menu.actions.filter(a => a.selected).map(a => a.id),
        })),
    }; */


  }

  getRole(role: Roles) {
    this.rolesForm.patchValue({
      id: role.id,
      name: role.name,  // Assurez-vous que vous utilisez 'name' pour le champ du rôle
    });
    this.menuIdsFormArray.clear(); // Réinitialiser les cases cochées

    if (role.menus) {
      role.menus.forEach(menu => {
        this.menuIdsFormArray.push(new FormControl(menu.id)); // Ajouter les menus déjà sélectionnés
      });
    }
  }

  onCheckboxChangeS(event: any, menuId: number) {
    if (event.target.checked) {
      this.menuIdsFormArray.push(new FormControl(menuId));
    } else {
      const index = this.menuIdsFormArray.controls.findIndex(control => control.value === menuId);
      if (index !== -1) {
        this.menuIdsFormArray.removeAt(index);
      }
    }

    console.log("checked ",this.menuIdsFormArray);

  }


  onCheckboxChangeAction(event: any, menuId: number, actionId: number) {
  const key = `${menuId}-${actionId}`;

  if (event.target.checked) {
    this.actionIdsFormArray.push(new FormControl(key));
  } else {
    const index = this.actionIdsFormArray.controls.findIndex(c => c.value === key);
    if (index !== -1) this.actionIdsFormArray.removeAt(index);
  }

  console.log("✅ actionIdsFormArray =", this.actionIdsFormArray.value);
}



  updateRole() {
    this.submitted = true;

    if (this.rolesForm.invalid) {
      return;
    }

    this.loading = true;
    this.rolesService.updateRole(this.rolesForm.value).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.getRoles();
        this.sweetAlertService.toastSuccess('Rôle modifié !', 3000);
        this.closeUpdateModal();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError('Erreur de modification !', 3000);
      }
    });
  }

  closeModal() {
    this.resetForm();
    document.getElementById('closeAddModal')?.click();
  }

  closeUpdateModal() {
    this.resetForm();
    document.getElementById('closeUpdateModal')?.click();
  }

  resetForm(){
    this.rolesForm.reset();
    Object.keys(this.rolesForm.controls).forEach((c) => {
      this.rolesForm.controls[c].setErrors(null);
    });
  }


 goBack(){
    window.history.back();
  }

}
