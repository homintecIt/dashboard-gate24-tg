import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import { AuthService } from 'src/app/services/auth.service';
import { storageHelper } from 'src/app/misc/storage.misc';
import { MustMatch } from 'src/app/validator/must-match.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  @Input() data!: any;
  submitted = false;
  loading = false;
  showPassword = false;

  user?: any;
  resetPasswordForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    console.log(this.user)
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
            )

          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.loading = true;

    var data = {
      password: this.resetPasswordForm.value.password,
      email: this.user.username,
    };


    console.log("datae",data);

    this.authService
      .firstResetPassword(data)
      .subscribe({
        next: (data: any) => {
          this.resetFormClose();
          this.sweetAlertService.toastSuccess('Mot de passe modifié !', 3000);
          this.loading = false;
          setTimeout(() => {
            this.onLogout();
          }, 1000);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.sweetAlertService.toastError(
            'Erreur !',
            5000,
            error.error.message ||
            error.error.error ||
            'Le service est temporairement indisponible'
          );
        },
      });
  }

  togglePassword(passwordInput: HTMLInputElement) {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.showPassword = true;
    } else {
      passwordInput.type = 'password';
      this.showPassword = false;
    }
  }

  resetForm() {
    this.resetPasswordForm.reset();
    this.submitted = false;
    Object.keys(this.resetPasswordForm.controls).forEach((c) => {
      this.resetPasswordForm.controls[c].setErrors(null);
    });
  }

  resetFormClose() {
    this.resetForm();
    document.getElementById('closeModal')?.click();
    this.bsModalRef.hide();
  }

  onLogout() {
    storageHelper.local.clear();
    storageHelper.session.clear();
    // this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
