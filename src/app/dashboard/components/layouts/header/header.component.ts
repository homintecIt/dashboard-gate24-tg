import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { site } from 'src/app/misc/api-endpoints.misc';
import { storageHelper } from 'src/app/misc/storage.misc';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser!: any;
  userRoleDisplay: string = '';
  site:any;
  isDarkMode = false;

  constructor(
    private router:Router,
    public authService:AuthService,
    private themeService: ThemeService
  ) { }


  ngOnInit(): void {
    this.currentUser =  this.authService.user;

    this.site = `${site}`
    console.log("user",this.currentUser);

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  userProfile(){
    this.router.navigate(['/dashboard/user/profile']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(){
    storageHelper.local.clear();
    this.router.navigate(['/auth/signin']);
  }
}
