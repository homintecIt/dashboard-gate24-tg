import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Menus } from 'src/app/models/menus.model';
import { MenusService } from 'src/app/services/menus.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent  implements OnInit{
  menus!: Menus[]
  menusForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
   // path: new FormControl(''),
  });

  submitted = false;
  loading = false;

  constructor(
    private router: Router,
    private menusService: MenusService,
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService) { }

  ngOnInit(): void {
    this.getMenus();
    this.menusForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required,]],
      //path: [ '', [Validators.required, Validators.minLength(3)] ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.menusForm.controls;
  }

  getMenus(){
    this.menusService.getMenus().subscribe({
      next: (data: any) => {
        this.menus = data;
      },
      error: (error: HttpErrorResponse) => {

      }
    })
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

  addMenus(){
    this.submitted = true;

    if (this.menusForm.invalid) {
      return;
    }

    this.loading = true;
    let form = this.menusForm.value;
    delete form.id;
    this.menusService.addMenus(this.menusForm.value).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.getMenus();
        this.sweetAlertService.toastSuccess('Site ajouté !', 3000);
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError('Erreur d\'enregistrement !', 3000);
      }
    })

  }

  getMenu(menu:any){
    this.menusForm.patchValue({
      id: menu.id,
      name: menu.name,
      ///path: menu.path
    })

  }

  updateMenu(){
    this.submitted = true;

    if (this.menusForm.invalid) {
      return;
    }

    this.loading = true;
    this.menusService.updateMenu(this.menusForm.value).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.getMenus();
        this.sweetAlertService.toastSuccess('Menu modifié !', 3000);
        this.closeUpdateModal();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.sweetAlertService.toastError('Erreur de modification !', 3000);
      }
    })

  }

  closeModal(){
    this.menusForm.reset();
    document.getElementById('closeAddModal')?.click();
  }

  closeUpdateModal(){
    this.menusForm.reset();
    document.getElementById('closeUpdateModal')?.click();
  }


 goBack(){
    window.history.back();
  }
}
