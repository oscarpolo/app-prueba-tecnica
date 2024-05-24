import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Products, NewOrder } from '../interfaces/interfaces';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})

export class CreateorderService {

  private baseUrl: string = environment.apiUrl;
  public products: Products[] = [];

  constructor(private http: HttpClient) { }

  searchProductsByName(query: string): Observable<any> {
    return this.http.post<Products[]>(`${this.baseUrl}/CyclingStore/ProductsByName`, {Name: query}).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error en la petición', error);
        throw error;
      })
    );
  }

  searchClientById(query: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/CyclingStore/ClientById`, {Id: query}).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error en la petición', error);
        throw error;
      })
    );
  }

  saveNewOrderAPI(newOrder: NewOrder): Observable<any> {
    return this.http.post(`${this.baseUrl}/CyclingStore/NewOrder`, newOrder).pipe(
      catchError(error => {
        console.error('Error en la petición', error);
        throw error;
      })
    );
  }
}
