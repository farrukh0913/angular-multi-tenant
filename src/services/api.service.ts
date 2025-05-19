import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  login(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/company-users/login`,
      payload
    );
  }

  userLogin(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/user/login`,
      payload
    );
  }

  addCompany(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/companies`,
      payload
    );
  }

  getCompanies(): Observable<any> {
    return this.httpClient.get<any>(`${environment.ApiUserUrl}/companies`);
  }

  getCompanyById(id: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ApiUserUrl}/companies/${id}`
    );
  }

  updateCompany(id: number, payload: any): Observable<any> {
    return this.httpClient.put<any>(
      `${environment.ApiUserUrl}/companies/${id}`,
      payload
    );
  }

  deleteCompany(id: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${environment.ApiUserUrl}/companies/${id}`
    );
  }

  addRole(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/roles`,
      payload
    );
  }

  getCompanyUsers(id: any): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.ApiUserUrl}/company-users/${id}`
    );
  }

  addCompanyUser(payload: any): Observable<any> {
    console.log('Payload:', payload);
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/company-users`,
      payload
    );
  }

  updateCompanyUser(payload: any): Observable<any> {
    return this.httpClient.patch<any>(
      `${environment.ApiUserUrl}/company-users/`,
      payload
    );
  }

  deleteCompanyUser(id: number, companyId: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${environment.ApiUserUrl}/company-users/${id}/${companyId}`
    );
  }

  getRelatedCompanies(email: string): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.ApiUserUrl}/relatedCompanies`,
      { email }
    );
  }
}
