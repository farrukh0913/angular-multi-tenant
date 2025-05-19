import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  user: any;

  constructor(private route: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user.privileges.includes(34)) this.company_permission = true;
    if (this.user.privileges.includes(35)) this.user_permission = true;
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
