import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleGeocodeService {
  resourceUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAaWrQOn3YZ1lAysYmXOn93FSspowzeLf0&address=';

  constructor(protected http: HttpClient) {}

  getFromAddress(address: string): Observable<HttpResponse<google.maps.GeocoderResult>> {
    return this.http.get<google.maps.GeocoderResult>(`${this.resourceUrl}${address}`, { observe: 'response' });
  }
}
