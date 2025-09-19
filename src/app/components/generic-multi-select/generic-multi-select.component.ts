import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interface générique avec contrainte de type
export interface SelectableItem {
  id: number | string;
  [key: string]: any;
}

@Component({
  selector: 'app-generic-multi-select',
  template: `
    <div class="dropdown multi-select-dropdown">
      <button
        class="btn btn-outline-secondary dropdown-toggle w-100"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ getSelectedItemsText() }}
      </button>
      <div class="dropdown-menu w-100 p-2" aria-labelledby="dropdownMenuButton">
        <div class="search-container mb-2">
          <input
            type="text"
            class="form-control"
            [(ngModel)]="searchText"
            placeholder="Rechercher..."
          />
        </div>
        <div class="dropdown-item-container">
          <div
            *ngFor="let item of filteredItems"
            class="form-check"
            [class.active-item]="isSelected(item)"
          >
            <input
              type="checkbox"
              class="form-check-input"
              [id]="'item-' + item.id"
              [checked]="isSelected(item)"
              (change)="toggleSelection(item)"
            />
            <label
              class="form-check-label w-100"
              [for]="'item-' + item.id"
            >
              {{ getDisplayValue(item) }}
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .multi-select-dropdown .dropdown-menu {
      max-height: 300px;
      overflow-y: auto;
    }
    .dropdown-item-container {
      max-height: 250px;
      overflow-y: auto;
    }
    .form-check {
      padding: 0.25rem 0.5rem;
      transition: background-color 0.2s ease;
    }
    .form-check:hover {
      background-color: #f8f9fa;
    }
    .active-item {
      background-color: #007bff;
      color: white;
    }
    .active-item:hover {
      background-color: #0056b3;
    }
    .active-item .form-check-label {
      color: white;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericMultiSelectComponent),
      multi: true
    }
  ]
})
export class GenericMultiSelectComponent<T extends SelectableItem> implements ControlValueAccessor, OnInit {
  // Items disponibles pour la sélection
  @Input() items: T[] = [];

  // Clé à utiliser pour l'affichage (label, name, title, etc.)
  @Input() displayKey: string = 'label';

  // Texte de placeholder
  @Input() placeholder: string = 'Sélectionner';

  // Texte de recherche
  searchText: string = '';

  // Items sélectionnés
  selectedItems: T[] = [];

  // Tableau filtré
  filteredItems: T[] = [];

  // Callbacks pour ngModel
  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit() {
    // Initialisation du tableau filtré
    this.filteredItems = this.items;

    // Validation de la clé d'affichage
    if (this.items.length > 0) {
      const firstItem = this.items[0];
      if (!(this.displayKey in firstItem)) {
        console.warn(`La clé "${this.displayKey}" n'existe pas dans les items. Utilisation de l'ID.`);
      }
    }
  }

  // Méthode pour obtenir la valeur d'affichage
  getDisplayValue(item: T): string {
    // Si la clé n'existe pas, retourne l'ID
    return item[this.displayKey] ?? item.id.toString();
  }

  // Implémentation de ControlValueAccessor
  writeValue(value: T[]): void {
    console.log('writeValue appelé avec:', value);  // Confirme que cette fonction est exécutée
    this.selectedItems = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Filtrage des items
  filterItems(): void {
    if (!this.searchText) {
      this.filteredItems = this.items;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      this.getDisplayValue(item).toLowerCase().includes(searchLower)
    );
  }

  // Bascule de la sélection
  toggleSelection(item: T) {
    const index = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }

    console.log('Selected items in child:', this.selectedItems);
    this.onChange(this.selectedItems);  // Assurez-vous que onChange est correctement appelé
  }

  // Vérification de la sélection
  isSelected(item: T): boolean {
    return this.selectedItems.some(
      selectedItem => selectedItem.id === item.id
    );
  }

  // Texte des éléments sélectionnés
  getSelectedItemsText(): string {
    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }
    return this.selectedItems.map(item => this.getDisplayValue(item)).join(', ');
  }

}
