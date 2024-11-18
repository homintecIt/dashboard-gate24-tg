import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { storageHelper } from 'src/app/misc/storage.misc';
import { jwtTokenIdentifier, userIdentifier } from 'src/app/misc/utilities.misc';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;

  submitted = false;
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [ '', [Validators.required, Validators.email]],
      password: [ '', Validators.required]
    });

    this.listenToAuthEvents();
  }


  get form(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  listenToAuthEvents() {
    this.authService.authSuccessEvent.subscribe((data) => {
        this.submitted = false;

        var userAccessToken = data.access_token;
        var userData = data.user;
        storageHelper.local.store(`${jwtTokenIdentifier}`, userAccessToken);
        storageHelper.local.store(`${userIdentifier}`, userData);
        this.router.navigateByUrl("/dashboard");
      }
    );

    this.authService.authFailureEvent.subscribe((error: HttpErrorResponse) => {
      this.submitted = false;
      if (error.status === 400 || error.status === 404 || error.status === 401) {
        this.sweetAlertService.toastError('Erreur de connexion !', 5000, 'Veuillez vérifier vos accès et réessayer');
      } else {
        this.sweetAlertService.toastError('Erreur de connexion !', 5000, 'Le service est temporairement indisponible');
      }
    });

  }


  onSignin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const email: string = this.loginForm.get('email')?.value;
    const password: string = this.loginForm.get('password')?.value;

    this.loading = true;
    this.authService.login(email, password).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.authService.onAuthSuccess(data);
        this.authService.setAuthUser(data);
        this.sweetAlertService.toastSuccess('Connexion réussie!', 3000);
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false
        this.authService.onAuthFailure(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }


  resetForm(){
    this.loginForm.reset();
    Object.keys(this.loginForm.controls).forEach(c => {
      this.loginForm.controls[c].setErrors(null);
    });
  }

  togglePassword(passwordInput: HTMLInputElement) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.showPassword = true;
    } else {
      passwordInput.type = "password";
      this.showPassword = false;
    }
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
