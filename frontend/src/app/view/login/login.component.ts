import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { LoginRequest } from '@core/models';
import { AuthFacade } from '@core/auth/auth.facade';

@Component({
  selector: 'tb-login',
  standalone: true,
  imports: [
    RouterLink,
    CardModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);

  loading = this.authFacade.loading;
  error = this.authFacade.error;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    const credentials: LoginRequest = this.form.getRawValue();
    this.authFacade.login(credentials);
  }
}