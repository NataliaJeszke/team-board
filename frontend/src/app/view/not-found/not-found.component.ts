import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tb-not-found',
  standalone: true,
  imports: [RouterLink, CardModule, ButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
