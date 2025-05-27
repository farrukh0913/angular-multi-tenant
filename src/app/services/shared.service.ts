import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ICompany } from '../constant/shared.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private showLiSubject = new BehaviorSubject<boolean>(false);
  showLi$ = this.showLiSubject.asObservable();

  constructor(
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  /**
   * Displays a confirmation dialog for deletion.
   * @param text - The text to display in the confirmation message.
   * @returns A promise that resolves to true if the user confirms, false otherwise.
   */
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

  /**
   * Shows the list item based on the current state.
   * This method toggles the visibility of the list item.
   */
  showLi() {
    this.showLiSubject.next(true);
  }

  /**
   * Hides the list item based on the current state.
   * This method toggles the visibility of the list item.
   */
  hideLi() {
    this.showLiSubject.next(false);
  }

  /**
   * Retrieves the user information from local storage.
   * @returns The user object parsed from local storage, or an empty object if not found.
   */
  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Retrieves the list of companies from the API.
   * @returns An observable that emits an array of companies.
   */
  getCompanies(): Observable<ICompany[]> {
    return this.apiService.get('companies').pipe(
      catchError((err) => {
        this.toastService.showError(
          err.error?.error?.message || 'Error occurred'
        );
        return throwError(() => err);
      })
    );
  }

  /**
   * Retrieves related companies based on the user's email.
   * @param email - The user's email address.
   * @returns An observable that emits an array of related companies.
   */
  getRelatedCompanies(email: string): Observable<ICompany[]> {
    return this.apiService.post('relatedCompanies', { email }).pipe(
      catchError((err) => {
        this.toastService.showError(
          err.error?.error?.message || 'Error occurred'
        );
        return throwError(() => err);
      })
    );
  }
}
