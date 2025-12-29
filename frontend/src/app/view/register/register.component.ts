import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';

import { RegisterRequest } from '@core/models';
import { AuthFacade } from '@core/auth/auth.facade';

@Component({
  selector: 'tb-register',
  standalone: true,
  imports: [
    CardModule,
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
  private authFacade = inject(AuthFacade);

  loading$ = this.authFacade.loading$;
  error$ = this.authFacade.error$;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    const data: RegisterRequest = this.form.getRawValue();
    this.authFacade.register(data);
  }
}