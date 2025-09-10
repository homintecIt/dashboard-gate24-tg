import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Role, UserService } from '../../services/users-service.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users-edit-modal',
  templateUrl: './users-edit-modal.component.html'
})
export class UsersEditModalComponent implements OnInit {
  @Input() data!: User;
  editForm!: FormGroup;
        roles: Role[] = []; // au lieu de Role | undefined

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: BootstrapModalService,
    public bsModalRef: BsModalRef,
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      roleId: [this.data.role?.id, Validators.required],
      id: [this.data.id],
      phone: [this.data.phone],
      password: [this.data.password],
    });
    this.getRoles();

  }

  onSubmit(): void {
    console.log(this.data);

    if (this.editForm.valid) {
      this.userService.updateUser( this.editForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          this.bsModalRef.hide();

        }
      });
    }
  }

    getRoles(){

    this.userService.getRoles().subscribe({
      next: (data :any) => {
          this.roles = data;
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          this.bsModalRef.hide();

        }
    })
  }
}
