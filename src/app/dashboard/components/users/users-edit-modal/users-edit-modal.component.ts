import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../services/users-service.service';

@Component({
  selector: 'app-users-edit-modal',
  // templateUrl: './users-edit-modal.component.html'
  template: `
  <div class="modal-header">
  <h5 class="modal-title">Modifier l'utilisateur</h5>
  <button type="button" class="btn-close" aria-label="Close" ></button>
</div>
<div class="modal-body">
  <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
    <div class="mb-3">
      <label for="name" class="form-label">Nom</label>
      <input type="text" id="name" class="form-control" formControlName="name">
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" id="email" class="form-control" formControlName="email">
    </div>
    <div class="mb-3">
      <label for="role" class="form-label">Rôle</label>
      <select id="role" class="form-select" formControlName="role">
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
      </select>
    </div>
    <div class="text-end">
      <button type="button" class="btn btn-secondary" >Annuler</button>
      <button type="submit" class="btn btn-primary" [disabled]="editForm.invalid">Enregistrer</button>
    </div>
  </form>
</div>

  `
})
export class UsersEditModalComponent implements OnInit {
  editForm: FormGroup;

  @Input() user: User;


  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log("USER INIT",this.user);
    if (!this.user) {
      throw new Error('User data is required');
    }
    this.editForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      role: [this.user.role, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.userService.updateUser( this.editForm.value).subscribe({
        next: () => {
          // this.activeModal.close('success');
        },
        error: (err) => console.error('Erreur de mise à jour', err)
      });
    }
  }
}
