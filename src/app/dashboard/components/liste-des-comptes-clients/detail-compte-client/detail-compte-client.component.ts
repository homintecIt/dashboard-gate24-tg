import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListesClientService } from 'src/app/services/liste-client.service';

@Component({
  selector: 'app-detail-compte-client',
  templateUrl: './detail-compte-client.component.html',
  styleUrls: ['./detail-compte-client.component.css']
})
export class DetailCompteClientComponent implements OnInit {
  account!: any;

  constructor(
    private route: ActivatedRoute,
    private clientService: ListesClientService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const accountNumber = params['accountNumber'];
      this.getAccountbyAccountNumber(accountNumber);
      console.log(accountNumber);

    });
  }

  getAccountbyAccountNumber(accountNumber: string) {
    this.clientService.getAccountbyAccountNumber(accountNumber).subscribe(
      (data) => {
        this.account = data;
        console.log(this.account);

      },
      (error) => {
        console.error(error);
      }
    );
  }
}
