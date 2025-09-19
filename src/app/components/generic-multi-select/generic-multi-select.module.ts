import { NgModule } from '@angular/core';

import { GenericMultiSelectComponent } from './generic-multi-select.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GenericMultiSelectComponent,],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [GenericMultiSelectComponent]
})
export class MultiSelectModule { }
