import { Component, Input } from '@angular/core';
import { User, UserService } from '../../services/users-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BootstrapModalService } from 'src/app/services/bootstrap-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users-affect-route-modal',
  templateUrl: './users-affect-route-modal.component.html',
  styleUrls: ['./users-affect-route-modal.component.css']
})
export class UsersAffectRouteModalComponent {
  @Input() data!: User;
  editForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: BootstrapModalService,
    public bsModalRef: BsModalRef,
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      id: [this.data.id],
    });
  }


}
