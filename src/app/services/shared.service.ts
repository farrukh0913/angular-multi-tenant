import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ICompany, IUser } from '../constant/shared.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private userSubject = new BehaviorSubject<any>(null);

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
   * Add the current user by emitting a new value through the BehaviorSubject.
   *
   * @param user - The user object to be set as the current user.
   */
  setUser(user: IUser) {
    this.userSubject.next(user);
  }

  /**
   * Retrieves the current user from localStorage and emits it via the BehaviorSubject.
   * If a user is found in localStorage, it updates the `userSubject`.
   *
   * @returns Observable<IUser | null> - An observable of the current user.
   */
  getUser() {
    const getUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (getUser) this.userSubject.next(getUser);
    return this.userSubject.asObservable();
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
