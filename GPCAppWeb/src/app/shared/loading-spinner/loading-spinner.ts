import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    template: `<div [ngClass]="{gogSpinner: gameType === 'gog', steamSpinner: gameType === 'steam'}"><div class="lds-ring"><div></div></div><div></div><div></div><div></div></div>`,
    styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
    @Input() gameType: string;
}
