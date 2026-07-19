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
export class QueueVisualizationService {
  private readonly baseUrl = '/vis-api/v1/queue';

  constructor(private readonly http: HttpClient) {}

  enqueue(value: number): Observable<StateResponse> {
    return this.http.post<StateResponse>(`${this.baseUrl}/enqueue`, value);
  }

  dequeue(): Observable<StateResponse> {
    return this.http.post<StateResponse>(`${this.baseUrl}/dequeue`, {});
  }

  peek(): Observable<StateResponse> {
    return this.http.get<StateResponse>(`${this.baseUrl}/peek`);
  }

  create(values: number[]): Observable<StateResponse> {
    return this.http.post<StateResponse>(this.baseUrl, values);
  }
}
