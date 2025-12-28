import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { AuthActions } from '@core/auth/store/auth.actions';
import { selectAuthLoading, selectAuthError } from '@core/auth/store/auth.selectors';

@Component({
  selector: 'tb-register',
  imports: [
    Card,
    AsyncPipe,
    RouterLink,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.store.dispatch(
      AuthActions.register({
        data: this.form.getRawValue(),
      })
    );
  }
}
