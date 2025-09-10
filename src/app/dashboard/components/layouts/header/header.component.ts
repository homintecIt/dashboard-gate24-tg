import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { storageHelper } from 'src/app/misc/storage.misc';
import { userIdentifier } from 'src/app/misc/utilities.misc';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser!: User | null;
  userRoleDisplay: string = '';
  constructor(
    private router:Router,
  ) { }


  ngOnInit(): void {
    this.currentUser = storageHelper.local.get(`${userIdentifier}`);
  }

  userProfile(){
    this.router.navigate(['/dashboard/user/profile']);
  }


  onLogout(){
    storageHelper.local.clear();
    this.router.navigate(['/auth/signin']);
  }
}
