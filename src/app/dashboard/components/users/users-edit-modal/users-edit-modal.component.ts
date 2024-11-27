import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/users-service.service';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users-edit-modal',
  templateUrl: './users-edit-modal.component.html'
})
export class UsersEditModalComponent implements OnInit {
  @Input() data!: User;
  editForm!: FormGroup;

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
      role: [this.data.role, Validators.required],
      id: [this.data.id],
      created_at: [this.data.created_at],
      updated_at: [this.data.updated_at],
      phone: [this.data.phone],
      password: [this.data.password],
      image_profil: [this.data.image_profil],
      email_verified_at: [this.data.email_verified_at],
      api_token: [this.data.api_token],
      remember_token: [this.data.remember_token],
      account_number: [this.data.account_number],
      is_active: [this.data.is_active],
    });
  }

  onSubmit(): void {
    console.log(this.data);

    if (this.editForm.valid) {
      this.userService.updateUser( this.editForm.value).subscribe({
        next: () => {
          console.log("ok");

          this.bsModalRef.hide();
        },
        error: (err) => {
          console.error('Erreur de mise à jour', err);
          this.bsModalRef.hide();

        }
      });
    }
  }
}
