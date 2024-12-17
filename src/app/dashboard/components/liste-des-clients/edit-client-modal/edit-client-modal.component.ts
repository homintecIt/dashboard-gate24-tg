import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListesClientService } from 'src/app/services/liste-client.service';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/models/listeClient.model';

@Component({
  selector: 'app-edit-client-modal',
  templateUrl: './edit-client-modal.component.html',
  styleUrls: ['./edit-client-modal.component.css']
})
export class EditClientModalComponent implements OnInit {
  client!: any;

  constructor(
    private route: ActivatedRoute,
    private clientService: ListesClientService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tel = params['tel'];
      this.getClientByTel(tel);
    });
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

}
