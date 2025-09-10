import { Pipe, PipeTransform } from '@angular/core';
import { SelectableItem } from '../components/generic-multi-select/generic-multi-select.component';

@Pipe({
  name: 'multiSelectFilter'
})
export class MultiSelectFilterPipe implements PipeTransform {
  transform(
    items: SelectableItem[],
    searchText: string,
    displayKey: string = 'label'
  ): SelectableItem[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item =>
      item[displayKey].toString().toLowerCase().includes(searchText)
    );
  }
}
