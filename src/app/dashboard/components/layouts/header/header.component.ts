import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { site } from 'src/app/misc/api-endpoints.misc';
import { storageHelper } from 'src/app/misc/storage.misc';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser!: any;
  userRoleDisplay: string = '';
  site:any;
  constructor(
    private router:Router,
    public authService:AuthService

  ) { }


  ngOnInit(): void {
    this.currentUser =  this.authService.user;

    this.site = `${site}`
    console.log("user",this.currentUser);

  }

  userProfile(){
    this.router.navigate(['/dashboard/user/profile']);
  }


  onLogout(){
    storageHelper.local.clear();
    this.router.navigate(['/auth/signin']);
  }
}
