import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Modifies the URL by appending the id and company_id if they are provided.
   * @param url - The base URL to modify.
   * @param id - The user ID to append to the URL.
   * @param company_id - The company ID to append to the URL.
   * @returns The modified URL.
   */
  modifyUrl(url: string, id: string | number, company_id: number) {
    if (id) url += `/${id}`;
    if (company_id) url += `/${company_id}`;
    return url;
  }

  /**
   * Performs a GET request to the specified endpoint with optional IDs.
   * @param endpoint - The API endpoint to call.
   * @param ids - Optional IDs to append to the URL.
   * @returns An Observable of the response.
   */
  get(endpoint: string, ...ids: any): Observable<any> {
    const { id, company_id } = ids[0] ?? {};
    const apiUrl: string = this.modifyUrl(
      `${environment.ApiUserUrl}/${endpoint}`,
      id,
      company_id
    );
    return this.httpClient.get<any>(apiUrl);
  }

  /**
   * Performs a POST request to the specified endpoint with the given payload and optional IDs.
   * @param endpoint - The API endpoint to call.
   * @param payload - The data to send in the request body.
   * @param ids - Optional IDs to append to the URL.
   * @returns An Observable of the response.
   */
  post(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const { id, company_id } = ids[0] ?? {};
    const apiUrl: string = this.modifyUrl(
      `${environment.ApiUserUrl}/${endpoint}`,
      id,
      company_id
    );
    return this.httpClient.post<any>(apiUrl, payload);
  }

  /**
   * Performs a PUT request to the specified endpoint with the given payload and optional IDs.
   * @param endpoint - The API endpoint to call.
   * @param payload - The data to send in the request body.
   * @param ids - Optional IDs to append to the URL.
   * @returns An Observable of the response.
   */
  put(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const { id, company_id } = ids[0] ?? {};
    const apiUrl: string = this.modifyUrl(
      `${environment.ApiUserUrl}/${endpoint}`,
      id,
      company_id
    );
    return this.httpClient.put<any>(apiUrl, payload);
  }

  /**
   * Performs a PATCH request to the specified endpoint with the given payload and optional IDs.
   * @param endpoint - The API endpoint to call.
   * @param payload - The data to send in the request body.
   * @param ids - Optional IDs to append to the URL.
   * @returns An Observable of the response.
   */
  patch(endpoint: string, payload: any, ...ids: any): Observable<any> {
    const { id, company_id } = ids[0] ?? {};
    const apiUrl: string = this.modifyUrl(
      `${environment.ApiUserUrl}/${endpoint}`,
      id,
      company_id
    );
    return this.httpClient.patch<any>(apiUrl, payload);
  }

  /**
   * Performs a DELETE request to the specified endpoint with optional IDs.
   * @param endpoint - The API endpoint to call.
   * @param ids - Optional IDs to append to the URL.
   * @returns An Observable of the response.
   */
  delete(endpoint: string, ...ids: any): Observable<any> {
    const { id, company_id } = ids[0] ?? {};
    const apiUrl: string = this.modifyUrl(
      `${environment.ApiUserUrl}/${endpoint}`,
      id,
      company_id
    );
    return this.httpClient.delete<any>(apiUrl);
  }
}
