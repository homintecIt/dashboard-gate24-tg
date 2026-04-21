import { EditTagComponent } from './../edit-tag/edit-tag.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { storageHelper } from 'src/app/misc/storage.misc';
import { searchType, swalAnimation } from 'src/app/misc/utilities.misc';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { DateService } from 'src/app/services/date.service';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import Swal from 'sweetalert2';
import { AddTagCompteComponent } from '../add-tag-compte/add-tag-compte.component';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { AddRechargesComponent } from '../add-recharges/add-recharges.component';
import { AuthService } from 'src/app/services/auth.service';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-show-tag',
  templateUrl: './show-tag.component.html',
  styleUrls: ['./show-tag.component.css'],
})
export class ShowtagComponent implements OnInit {
  date!: Date;
  detail?: any;

  targNotUse: any;
  constructor(
    private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,
    private modalService: BootstrapModalService,
    private dateService: DateService,
    private router: Router,
    public authService:AuthService

  ) {
    const navigation = this.router.getCurrentNavigation();
    this.detail = navigation?.extras?.state?.['data'];
  }

  ngOnInit(): void {
    this.currentDate();
    const data = storageHelper.local.get(`${searchType}`);

    if (!this.detail && data !== '') {
      this.getData(data);
    } else {
      // this.router.navigate(['/dashboard/statistics']);
    }

    this.loadData();
  }

  loadData() {
    let value = storageHelper.local.get(`${searchType}`);
    this.generalService.successEvent.subscribe((data) => {
        const newtel =  storageHelper.local.get(`${searchType}`);
        if (newtel.type =='tagCode'&& newtel.value != value['tel']) {
          value= {
             type: 'tagCode',
          value: data.value,
          }
      this.getData(value);

        }else{
      this.getData(value);

        }
    }
  );
  }

  currentDate() {
    this.dateService.currentDate$.subscribe((date) => {
      this.date = date;
    });
  }

  getData(data: any) {

    console.log("date",data);

    if (data.type === 'accountNumber') {
      this.generalService.getCompteClient(data.value).subscribe({
        next: (resp) => {
          this.detail = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'targID') {
      this.generalService.searchWithTagID(data.value).subscribe({
        next: (resp: any) => {
          this.detail = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'tagCode') {
      this.generalService.searchWithTagCode(data.value).subscribe({
        next: (resp) => {
          this.detail = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'phoneNumber') {
      this.generalService.searchWithPhoneNumber(data.value).subscribe({
        next: (resp) => {
          this.detail = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }
  }



  rechargeAccount(data: any, type: 'compte' | 'tag') {
    const param: any = {
      type: type,
      data: data,
    }
    this.modalService.openModal(AddRechargesComponent, param, 'modal-md');
  }

  editClient(data: any) {
    this.modalService.openModal(EditClientComponent, data, 'modal-md');
  }

   editTag(data: any) {
    this.modalService.openModal(EditTagComponent, data, 'modal-md');
  }


  dialogModalStatus(data: any) {
    const status = data.statutTarg === 'actived' ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status} : "${data.tagCode}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        confirmButtonColor: ' #0d6efd',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: false,
        ...swalAnimation,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.changeStatus(data);
        } else {
        }
      });
  }

  dialogModalDelete(data: any) {
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous supprimer : "${data.tagCode}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        confirmButtonColor: ' #0d6efd',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: false,
        ...swalAnimation,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteTag(data.id);
        } else {
        }
      });
  }


  dialogModalChangeModePassage(data: any) {
    const status = data.isExo ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status} le mode exoneration pour : "${data.tagCode}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        confirmButtonColor: ' #0d6efd',
        cancelButtonColor: '#6c757d',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: false,
        ...swalAnimation,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.changeExoStatus(data);
        } else {
        }
      });
  }

  changeStatus(item: any) {
    const data = {
      isActive: item.statutTarg === 'actived' ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleStatus(data).subscribe({
      next: (data) => {
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
        // Reload data after success
        let value = storageHelper.local.get(`${searchType}`);
        if (value) {
          this.getData(value);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }


  changeExoStatus(item: any) {
    const data = {
      isExo: item.isExo ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleExoStatus(data).subscribe({
      next: (data) => {
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
        // Reload data after success
        let value = storageHelper.local.get(`${searchType}`);
        if (value) {
          this.getData(value);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  deleteTag(data: any) {
    this.generalService.deleteTag(data).subscribe({
      next: (data) => {
        this.generalService.successEvent.emit(data);
        this.sweetAlertService.toastSuccess('Tag supprimé avec succès', 3000);

      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  addTag(data: any) {
    this.modalService.openModal(AddTagCompteComponent, data, 'modal-md');
  }

  goBack() {
    window.history.back();
  }

}
