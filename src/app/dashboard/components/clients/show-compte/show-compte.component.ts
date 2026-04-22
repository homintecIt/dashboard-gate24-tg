import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { searchType, swalAnimation } from 'src/app/misc/utilities.misc';
import { TransfertTagComponent } from '../transfert-tag/transfert-tag.component';
import { TransfertSoldeComponent } from '../transfert-solde/transfert-solde.component';
import Swal from 'sweetalert2';
import { SaveCompteComponent } from '../save-compte/save-compte.component';
import { AddTagCompteComponent } from '../add-tag-compte/add-tag-compte.component';
import { RechargesListComponent } from '../../recharges-list/recharges-list.component';
import { AddRechargesComponent } from '../add-recharges/add-recharges.component';
import { storageHelper } from 'src/app/misc/storage.misc';
import { EditClientModalComponent } from '../edit-client-modal/edit-client-modal.component';
import { data } from 'jquery';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthService } from 'src/app/services/auth.service';
const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-show-compte',
  templateUrl: './show-compte.component.html',
  styleUrls: ['./show-compte.component.css']
})
export class ShowCompteComponent implements OnInit {
  client!: any;

  detail :any;

  // Filter and pagination properties
  filterTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  filteredAbonnements: any[] = [];
  paginatedAbonnements: any[] = [];

  constructor(
    public authService:AuthService,
    private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,
    private modalService: BootstrapModalService,
    private router: Router,
    public permissionService : PermissionService,



  ) {
    const navigation = this.router.getCurrentNavigation();

    this.detail = navigation?.extras?.state?.['data'];

  }

  ngOnInit() {

    const data = storageHelper.local.get(`${searchType}`);
    if (data !== '') {
      this.getCompteClient(data.value);
    }

    this.loadData()
  }

  // Filter and pagination methods
  filterAbonnements() {
    if (!this.detail?.abonnements) {
      this.filteredAbonnements = [];
      return;
    }

    if (!this.filterTerm || this.filterTerm.trim() === '') {
      this.filteredAbonnements = [...this.detail.abonnements];
    } else {
      const searchTerm = this.filterTerm.toLowerCase().trim();
      this.filteredAbonnements = this.detail.abonnements.filter((item: any) =>
        item.tagCode?.toLowerCase().includes(searchTerm)
      );
    }
    this.currentPage = 1;
    this.updatePaginatedAbonnements();
  }

  updatePaginatedAbonnements() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAbonnements = this.filteredAbonnements.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedAbonnements();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAbonnements.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDisplayRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredAbonnements.length);
  }

    goBack() {
    window.history.back();
  }





  loadData() {
      this.generalService.successEvent.subscribe((data: any) => {
      const value = storageHelper.local.get(`${searchType}`);
      this.getData(value);
    });
  }

    getData(data: any) {
    if (data.type === 'accountNumber') {
      this.generalService.getCompteClient(data.value).subscribe({
        next: (resp) => {
          this.detail = resp;
          this.filterAbonnements();
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'name') {
      this.generalService.searchWithName(data.value).subscribe({
        next: (resp: any) => {
          this.client = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'tagCode') {
      this.generalService.searchWithTagCode(data.value).subscribe({
        next: (resp) => {
          this.client = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }

    if (data.type === 'phoneNumber') {
      this.generalService.searchWithPhoneNumber(data.value).subscribe({
        next: (resp) => {
          this.client = resp;
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    }
  }


  getCompteClient(data:any) {

          console.log("datasxxxxxxxxxxxxxxx",data);

         this.generalService.getCompteClient(data).subscribe({
        next: (resp) => {
          this.detail = resp;
          this.filterAbonnements();
          console.log("datas",resp);

        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
  }

   rechargeAccount(data: any, type: 'compte' | 'tag') {
    const param: any = {
      type: type,
      data: data,
    }
    this.modalService.openModal(AddRechargesComponent, param, 'modal-md');
  }



  editClient(data: any) {
    this.modalService.openModal(EditClientComponent, data, 'modal-md modal-dialog-centered  ');
  }

  createClient(data: any) {
    this.modalService.openModal(SaveCompteComponent, data, 'modal-md modal-dialog-centered');
  }
   transferClient(data: any) {
 const compte = Array.isArray(data)
          ? data.map((item:any) => item.accountNumber)
          : [];
          const dataAll ={
              abonnement : data,
              comptes: compte
          }

    this.modalService.openModal(TransfertTagComponent, dataAll, 'modal-md modal-dialog-centered');
  }


   transfertSoldeToCompte(data: any) {

    this.modalService.openModal(TransfertSoldeComponent, this.getDataTransfert(data), 'modal-md modal-dialog-centered');
  }


  listAbonnementByCompte(data :any){
    this.generalService.successEvent.emit(data);
    this.router.navigate(['/dashboard/subscribe-list/compte']);


  }



  passages(){


  }

    getDataTransfert(data:any){

      const compte = Array.isArray(this.client?.compte)
          ? this.client.compte.map((item:any) => item.accountNumber)
          : [];
          const dataAll ={
              compte : data,
              comptes: compte
          }
          return dataAll;
    }

  dialogModalStatus(data: any) {
    const status = data.statutTarg === 'actived' ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status}  ${data.type_targ}: "${data.tagCode}" ?`,
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




  dialogModalStatusCompte(data: any) {
    const status = data.statut === 'actived' ? 'désactiver' : 'activer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status}  ${data.accountNumber} ?`,
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

          this.changeStatusCompte(data);
        } else {
        }
      });
  }

  dialogModalRestaureStatus(data: any) {
    const status = 'Restaurer';
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous ${status}  ${data.type_targ}: "${data.tagCode}" ?`,
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
          this.restaurerStatus(data);
        } else {
        }
      });
  }

  dialogModalDelete(data: any) {
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous supprimer ${data.type_targ}: "${data.tagCode}" ?`,
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
        text: `Voulez-vous ${status} le mode exoneré pour ${data.type_targ}: "${data.tagCode}" ?`,
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
  restaurerStatus(item: any) {
    const data = {
      isActive:false,
      tagId: item.tagId,
    }
    this.generalService.toggleStatus(data).subscribe({
      next: (data) => {
        item.statutTarg = 'disabled';

        //console.log(data)
        this.generalService.successEvent.emit(data);
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  changeStatus(item: any) {
    const data = {
      isActive: item.statutTarg === 'actived' ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleStatus(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        }, 500)

        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }


  changeStatusCompte(item: any) {
    const data = {
      accountNumber: item.accountNumber,
    }

    if (item.statut =='actived') {
   this.generalService.toggleStatusDesactivatedCompte(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        }, 500)

        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
    }


    if (item.statut =='disabled') {
   this.generalService.toggleStatusActivatedCompte(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        }, 500)

        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
    }

  }

  changeExoStatus(item: any) {
    const data = {
      isExo: item.isExo ? false : true,
      tagId: item.tagId,
    }

    this.generalService.toggleExoStatus(data).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.generalService.successEvent.emit(data);
        },  500)
        this.sweetAlertService.toastSuccess('Tag mis a jour avec succès', 5000);
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
        setTimeout (() => {
          this.generalService.successEvent.emit(data);
        }, 500)
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


}
