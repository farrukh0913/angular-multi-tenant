import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/constant/shared.interface';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  user: IUser | null = null;
  isSuperAdmin: boolean = false;
  permissions: number[] = [];
  showLi: boolean | undefined;

  constructor(private route: Router, private sharedService: SharedService) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.permissions = this.user?.privileges || [];

    if (!this.isSuperAdmin)
      this.sharedService.showLi$.subscribe((show) => {
        this.showLi = show;
      });
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
