import { Component } from '@angular/core';

import { ButtonDemo } from "../../common/wrappers/button/button.component";
import { ThemeToggleComponent } from "../../common/theme-toggle/theme-toggle.component";

@Component({
  selector: 'app-login',
  imports: [ButtonDemo, ThemeToggleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
