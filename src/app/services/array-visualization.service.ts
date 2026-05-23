import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArrayStateResponse {
  values: number[] | null;
  size: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArrayVisualizationService {
  private readonly baseUrl = '/vis-api/v1/arrays';

  constructor(private readonly http: HttpClient) {}

  create(values: number[]): Observable<ArrayStateResponse> {
    return this.http.post<ArrayStateResponse>(this.baseUrl, { values });
  }

  read(): Observable<ArrayStateResponse> {
    return this.http.get<ArrayStateResponse>(this.baseUrl);
  }

  update(index: number, value: number): Observable<ArrayStateResponse> {
    return this.http.put<ArrayStateResponse>(`${this.baseUrl}/${index}`, { value });
  }

  delete(index: number): Observable<ArrayStateResponse> {
    return this.http.delete<ArrayStateResponse>(`${this.baseUrl}/${index}`);
  }
}
