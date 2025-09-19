// subscription-status-switch.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from '../../services/subscribe-list.service';

@Component({
  selector: 'app-subscription-status-switch',
  template: `
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        [id]="'subscriptionStatusSwitch' + subscription.id"
        [checked]="subscription.statutTarg === 'actived'"
        (change)="toggleStatus()"
        [disabled]="isLoading"
      >
      <label
        class="form-check-label"
        [for]="'subscriptionStatusSwitch' + subscription.id"
      >
        {{ subscription.statutTarg === 'actived' ? 'Activé' : 'Désactivé' }}
      </label>
      <span *ngIf="isLoading" class="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>
  `,
  styles: [`
    .form-check-input:checked {
      background-color: #28a745;
      border-color: #28a745;
    }
    .form-check-input:not(:checked) {
      background-color: #dc3545;
      border-color: #dc3545;
    }
  `]
})
export class SubscriptionStatusSwitchComponent {
  @Input() subscription!: Subscription;
  @Output() statusChange = new EventEmitter<{ id: number, status: string }>();

  isLoading = false;

  toggleStatus(): void {
    // Déterminer le nouveau statut
    const newStatus = this.subscription.statutTarg === 'actived' ? 'disabled' : 'actived';

    // Émettre l'événement de changement de statut
    this.statusChange.emit({
      id: this.subscription.id,
      status: newStatus
    });
  }
}
