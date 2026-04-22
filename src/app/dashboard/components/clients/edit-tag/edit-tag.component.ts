import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { storageHelper } from 'src/app/misc/storage.misc';
import { searchType } from 'src/app/misc/utilities.misc';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.css']
})
export class EditTagComponent implements OnInit {
  @Input() data!: any;
  submitted = false;
  loading = false;
  compteClient: any;

  tageForm!: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private sweetAlertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.tageForm = this.formBuilder.group({
      tagId: ['', [Validators.required, Validators.minLength(2)]],
      tagCode: ['', [Validators.required, Validators.minLength(2)]],
      plaque: ['', []],
      typeTarg: ['', []],
    });


    if (this.data !== '') {

const tagId =  this.data.tagId.length >= 16 ?this.data.tagId:  BigInt(this.data.tagId);
const hexUpper =  this.data.tagId.length >= 16 ?this.data.tagId: tagId.toString(16).toUpperCase().padStart(16, '0');
        console.log('hexUpper',hexUpper);
      this.tageForm.patchValue({
        tagId: this.data.tagId.length >= 16 ? tagId : hexUpper,
        tagCode: this.data.tagCode,
        plaque: this.data.plaque,
        typeTarg: this.data.typeTarg,

      });
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.tageForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (this.tageForm.invalid) {
      return;
    }
    this.loading = true;

    const body={
      id : this.data.id,
      tagId: this.tageForm.value.tagId,
      tagCode: this.tageForm.value.tagCode,
        plaque: this.tageForm.value.plaque,
        typeTarg: this.tageForm.value.typeTarg,
    }

    this.generalService.updateTag(body).subscribe({
      next: (resp) => {
        const data = {
          type: 'tagCode',
          value: this.tageForm.value.tagCode,
        };
        storageHelper.local.store(`${searchType}`, data);
        this.handleSuccess(data, 'Client mis à jour avec succès')
      },
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  handleSuccess(data: any, message: string) {
    this.loading = false;
    this.generalService.successEvent.emit(data);
    this.sweetAlertService.toastSuccess(message, 5000);
    this.resetFormClose();
  }

  handleError(error: HttpErrorResponse) {
    this.loading = false;
    this.generalService.failureEvent.emit(error);
    this.sweetAlertService.toastError(
      'Erreur !',
      5000,
      error.error.message ||
        error.error.error ||
        'Le service est temporairement indisponible'
    );
  }

  resetForm() {
    this.tageForm.reset();
    this.submitted = false;
    Object.keys(this.tageForm.controls).forEach((c) => {
      this.tageForm.controls[c].setErrors(null);
    });
  }

  resetFormClose() {
    this.resetForm();
    this.bsModalRef.hide();
  }
}
