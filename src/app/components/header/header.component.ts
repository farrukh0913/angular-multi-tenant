import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/constant/shared.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showCompany: boolean = false;
  showUser: boolean = false;
  company_permission: Boolean = false;
  user_permission: Boolean = false;
  user: IUser | null = null;
  isSuperAdmin: boolean = false;

  constructor(private route: Router) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    if (this.user && this.user.privileges && this.user.privileges.includes(4))
      this.company_permission = true;
    if (this.user && this.user.privileges && this.user.privileges.includes(3))
      this.user_permission = true;
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  toggleForm(name: string) {
    if (name === 'company') {
      this.showCompany = true;
      this.showUser = false;
    } else {
      this.showUser = true;
      this.showCompany = false;
    }
  }
}
