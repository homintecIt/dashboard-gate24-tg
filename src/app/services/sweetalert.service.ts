import { Injectable } from "@angular/core";
import { swalAnimation } from "src/app/misc/utilities.misc";
import Swal from "sweetalert2";


@Injectable({
    providedIn: 'root',
})
export class SweetAlertService {
    show(title: string, text: string, typeIcon: any, confirmButtonText: string) {
        Swal.fire({
            title: title,
            text: text,
            icon: typeIcon,
            confirmButtonText: confirmButtonText,
            ...swalAnimation.swalAnimation
        });
    }

    toastSuccess(title: string, timer: number) {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar: true,
            timer: timer,
            title: title,
            ...swalAnimation.swalAnimation
        });
    }

    toastError(title: string, timer: number, text?: string) {
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            icon: 'error',
            timerProgressBar: true,
            timer: timer,
            title: title,
            text: text,
            ...swalAnimation.swalAnimation
        })
    }

    toastWarning(title: string, timer: number, text?: string) {
        Swal.fire({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            icon: 'warning',
            timerProgressBar: true,
            timer: timer,
            title: title,
            text: text,
            ...swalAnimation.swalAnimation

        })
    }

    toastInfo(title: string, timer: number) {
        Swal.fire({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            icon: 'info',
            timerProgressBar: true,
            timer: timer,
            title: title,
            ...swalAnimation.swalAnimation

        })
    }

    showLoading() {
        // Swal.fire({
        //     title: 'Veuillez patienter...',
        //     allowOutsideClick: false,
        //     onBeforeOpen: () => {
        //       Swal.showLoading()
        //   },
        // })
    }

    closeLoading() {
        Swal.close();
    }

}

