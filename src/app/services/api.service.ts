import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  modifyUrl(url: string, id: string | number, company_id: number) {
    if (id) url += `/${id}`;
    if (company_id) url += `/${company_id}`;
    return url;
  }

  get(endpoint: string, ...ids: any): Observable<any> {
    const {id, company_id} = ids.length ? ids[0] : [];
    const apiUrl: string = this.modifyUrl(`${environment.ApiUserUrl}/${endpoint}`, id, company_id);
    return this.httpClient.get<any>(apiUrl);
  }

  post(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const {id, company_id} = ids.length ? ids[0] : [];
    const apiUrl: string = this.modifyUrl(`${environment.ApiUserUrl}/${endpoint}`, id, company_id);
    return this.httpClient.post<any>(apiUrl, payload);
  }

  put(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const {id, company_id} = ids.length ? ids[0] : [];
    const apiUrl: string = this.modifyUrl(`${environment.ApiUserUrl}/${endpoint}`, id, company_id);
    return this.httpClient.put<any>(apiUrl, payload);
  }

  patch(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const {id, company_id} = ids.length ? ids[0] : [];
    const apiUrl: string = this.modifyUrl(`${environment.ApiUserUrl}/${endpoint}`, id, company_id);
    return this.httpClient.patch<any>(apiUrl, payload);
  }

  delete(endpoint: string, ...ids: any): Observable<any> {
    const {id, company_id} = ids.length ? ids[0] : [];
    const apiUrl: string = this.modifyUrl(`${environment.ApiUserUrl}/${endpoint}`, id, company_id);
    return this.httpClient.delete<any>(apiUrl);
  }
}
