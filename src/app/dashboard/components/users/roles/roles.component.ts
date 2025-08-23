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
  roles: any[] = [];
  actions: any[] = [];
  roleId?: number;
  rolesForm: FormGroup = new FormGroup({});
  rolePermissions: RolePermission = {
    roleId: 1, // id du rôle à modifier
    menus: []
  };

  submitted = false;
  loading = false;
  menus!: Menus[];
  menusSelection: MenuSelection[] = [];

  selectedMenuIds: number[] = [];  // Tableau des IDs sélectionnés

  constructor(
    private router: Router,
    private actionService: ActionService,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private menusService: MenusService,
    private sweetAlertService: SweetAlertService
  ) { }

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
    this.rolesService.getRolesWithPermissions().subscribe({
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


  submitRolesMenusAction() {
    this.submitted = true;
    if (this.rolesForm.invalid) {
      return;
    }

    this.loading = true;

    const bodyFormData = {
      roleName: this.rolesForm.value.name,
      menus: this.menusSelection
    };
    this.rolesService.submitRolePermissions(bodyFormData).subscribe({
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




  openUpdateModal(role: any) {
    // Nom du rôle
    this.rolesForm.patchValue({
      name: role.name,
    });

    this.roleId = role.id;

    // Réinitialiser les FormArray
    this.menuIdsFormArray.clear();
    this.actionIdsFormArray.clear();

    // Charger les permissions existantes
    role.permissions.forEach((perm: any) => {
      // Menu coché
      this.menuIdsFormArray.push(new FormControl(perm.menu.id));

      // Actions cochées pour ce menu
      perm.actions.forEach((action: any) => {
        const key = perm.menu.id + '-' + action.id;
        this.actionIdsFormArray.push(new FormControl(key));
      });
    });


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

  }


  onCheckboxChangeAction(event: any, menuId: number, actionId: number) {
    const key = `${menuId}-${actionId}`;

    const data = {
      menuId: menuId,
      actionId: actionId,
    }

    let menu = this.menusSelection.find(m => m.menuId! === menuId);

    if (event.target.checked) {
      this.actionIdsFormArray.push(new FormControl(data));

      if (!menu) {
        // si le menu n’existe pas encore
        this.menusSelection.push({
          menuId: menuId,
          actions: [actionId],
        });
      } else {
        // ajoute l’action si pas déjà présente
        if (!menu.actions.includes(actionId)) {
          menu.actions.push(actionId);
        }
      }
    } else {  // Supprime dans le FormArray
      const index = this.actionIdsFormArray.controls.findIndex(
        c => c.value.menuId === menuId && c.value.actionId === actionId
      );
      if (index !== -1) this.actionIdsFormArray.removeAt(index);

      if (menu) {
        // enlève l’action
        menu.actions = menu.actions.filter(a => a !== actionId);

        // supprime le menu si plus d’actions
        if (menu.actions.length === 0) {
          this.menusSelection = this.menusSelection.filter(m => m.menuId !== menuId);
        }
      }
    }


  }



  updateRole() {
    this.submitted = true;

    if (this.rolesForm.invalid) {
      return;
    }

    const payload = {
      roleName: this.rolesForm.value.name,
      roleId: this.roleId,
      menus: this.menusSelection
    };

    this.loading = true;
    this.rolesService.updateRolePermissions(payload).subscribe({
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

  resetForm() {
    this.rolesForm.reset();
    Object.keys(this.rolesForm.controls).forEach((c) => {
      this.rolesForm.controls[c].setErrors(null);
    });
  }


  goBack() {
    window.history.back();
  }

}
