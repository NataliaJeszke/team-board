import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'common-button',
    templateUrl: './button.component.html',
    imports: [ButtonModule]
})
export class ButtonDemo {}