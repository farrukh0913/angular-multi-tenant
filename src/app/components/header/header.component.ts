import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
  private destroy$ = new Subject<void>();

  constructor(private route: Router, private sharedService: SharedService) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  ngOnInit() {
    this.sharedService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.permissions = res?.privileges || [];
      });
  }

  logOut() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
