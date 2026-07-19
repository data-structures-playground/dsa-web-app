import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StateResponse {
  values: number[] | null;
  size: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class StackVisualizationService {
  private readonly baseUrl = '/vis-api/v1/stack';

  constructor(private readonly http: HttpClient) {}

  push(value: number): Observable<StateResponse> {
    return this.http.post<StateResponse>(`${this.baseUrl}/push`, value);
  }

  pop(): Observable<StateResponse> {
    return this.http.post<StateResponse>(`${this.baseUrl}/pop`, {});
  }

  peek(): Observable<StateResponse> {
    return this.http.get<StateResponse>(`${this.baseUrl}/peek`);
  }

  create(values: number[]): Observable<StateResponse> {
    return this.http.post<StateResponse>(this.baseUrl, values);
  }
}
