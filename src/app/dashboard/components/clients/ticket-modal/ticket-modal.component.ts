import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ticket-modal',
  templateUrl: './ticket-modal.component.html',
  styleUrls: ['./ticket-modal.component.css']
})
export class TicketModalComponent implements OnInit {
  @Input() data!: any;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    if (this.data !== '') {
      this.printReceipt();
    }
  }

  printReceipt() {
    window.print();
  }
}
