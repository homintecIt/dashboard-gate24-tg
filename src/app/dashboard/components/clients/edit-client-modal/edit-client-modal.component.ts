import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { Component, OnInit } from '@angular/core';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { SweetAlertService } from 'src/app/services/sweetalert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { swalAnimation } from 'src/app/misc/utilities.misc';
import { TransfertTagComponent } from '../transfert-tag/transfert-tag.component';
import { TransfertSoldeComponent } from '../transfert-solde/transfert-solde.component';
import Swal from 'sweetalert2';
import { SaveCompteComponent } from '../save-compte/save-compte.component';
import { AddTagCompteComponent } from '../add-tag-compte/add-tag-compte.component';
import { RechargesListComponent } from '../../recharges-list/recharges-list.component';
import { AddRechargesComponent } from '../add-recharges/add-recharges.component';
import { storageHelper } from 'src/app/misc/storage.misc';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthService } from 'src/app/services/auth.service';
const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true,
});

@Component({
  selector: 'app-edit-client-modal',
  templateUrl: './edit-client-modal.component.html',
  styleUrls: ['./edit-client-modal.component.css']
})
export class EditClientModalComponent implements OnInit {
  client!: any;

  constructor(
    private route: ActivatedRoute,
    private clientService: ListesClientService,
    private generalService: GeneralService,
    private sweetAlertService: SweetAlertService,
    private modalService: BootstrapModalService,
    private router: Router,
    public permissionService : PermissionService,
    public authService:AuthService




  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tel = params['tel'];
      this.getClientByTel(tel);
    });
    this.loadData()
  }

  dialogModalRestoreCompte(compte: any) {
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous restaurer le compte: "${compte.accountNumber}" ?`,
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
          this.restoreCompte(compte.accountNumber);
        } else {
        }
      });
  }

    goBack() {
    window.history.back();
  }



  loadData() {
    this.generalService.successEvent.subscribe((data: any) => {
        ///console.log("data",data);
       this.route.params.subscribe(params => {
      const tel = params['tel'];
      this.getClientByTel(tel);
    });
      ////const value = storageHelper.local.get(`${searchType}`);
    //  this.getData(data);
    });
  }

    getData(data: any) {
    if (data.type === 'accountNumber') {
      this.generalService.getCompteClient(data.value).subscribe({
        next: (resp) => {
          this.client = resp;
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


  getClientByTel(tel: string) {
    this.clientService.getClientByTel(tel).subscribe(
      (data) => {
        this.client = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

   rechargeAccount(data: any, type: 'compte' | 'tag') {
    const param: any = {
      type: type,
      data: data,
    }
    this.modalService.openModal(AddRechargesComponent, param, 'modal-md');
  }



  editClient(data: any) {
    this.modalService.openModal(EditClientModalComponent, data, 'modal-md');
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

  dialogModalDeleteCompte(compte: any) {
    swalWithBootstrapButtons
      .fire({
        title: 'Attention !!!',
        text: `Voulez-vous supprimer le compte: "${compte.accountNumber}" ?`,
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
          this.deleteCompte(compte.accountNumber);
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

  deleteCompte(accountNumber: string) {
    this.clientService.deleteAccount(accountNumber).subscribe({
      next: (resp) => {
        // Mettre à jour le statut local à 'deleted' au lieu de retirer l'élément
        if (Array.isArray(this.client?.compte)) {
          const idx = this.client.compte.findIndex((c: any) => c.accountNumber === accountNumber);
          if (idx > -1) {
            this.client.compte[idx] = { ...this.client.compte[idx], statut: 'deleted' };
          }
        }
        // Notifier pour rafraîchir les données ailleurs si nécessaire
        setTimeout(() => {
          this.generalService.successEvent.emit({ type: 'accountDeleted', accountNumber });
        }, 300);
        this.sweetAlertService.toastSuccess('Compte supprimé avec succès', 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.generalService.failureEvent.emit(error);
        this.sweetAlertService.toastError('Erreur !', 5000, (error.error.message || error.error.error) || 'Le service est temporairement indisponible');
      },
    });
  }

  restoreCompte(accountNumber: string) {
    this.clientService.restoreAccount(accountNumber).subscribe({
      next: () => {
        // Mettre à jour le statut local à 'disabled' (restauré mais inactif par défaut)
        if (Array.isArray(this.client?.compte)) {
          const idx = this.client.compte.findIndex((c: any) => c.accountNumber === accountNumber);
          if (idx > -1) {
            this.client.compte[idx] = { ...this.client.compte[idx], statut: 'disabled' };
          }
        }
        setTimeout(() => {
          this.generalService.successEvent.emit({ type: 'accountRestored', accountNumber });
        }, 300);
        this.sweetAlertService.toastSuccess('Compte restauré avec succès', 3000);
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
