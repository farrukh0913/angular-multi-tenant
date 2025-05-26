import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private showLiSubject = new BehaviorSubject<boolean>(false);
  showLi$ = this.showLiSubject.asObservable();

  constructor(private confirmationService: ConfirmationService) {}

  deleteConfirm(text: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmationService.confirm({
        message: `Do you want to delete this ${text}?`,
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        },
      });
    });
  }

  showLi() {
    this.showLiSubject.next(true);
  }

  hideLi() {
    this.showLiSubject.next(false);
  }
}
