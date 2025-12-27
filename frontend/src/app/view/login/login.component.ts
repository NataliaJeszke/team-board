import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthActions } from '../../core/auth/store/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../core/auth/store/auth.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule, 
    RouterLink,
    ButtonModule, 
    InputTextModule, 
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.store.dispatch(AuthActions.login({ 
      credentials: this.form.getRawValue() 
    }));
  }
}