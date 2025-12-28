import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { CardModule } from 'primeng/card'; 
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { AuthActions } from '@core/auth/store/auth.actions';
import { selectAuthLoading, selectAuthError } from '@core/auth/store/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    CardModule,
    ButtonModule, 
    MessageModule,
    PasswordModule,
    InputTextModule, 
    ReactiveFormsModule, 
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

  constructor() {
    this.loading$.subscribe(loading => {
      if (loading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.store.dispatch(AuthActions.login({ 
      credentials: this.form.getRawValue() 
    }));
  }
}