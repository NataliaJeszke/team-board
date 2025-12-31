import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateTaskDto,
  TaskListResponse,
  TaskResponse,
} from '@core/api/models/task/task-api.model';

import { TaskStatus } from '@feature/tasks/tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  getTasks(): Observable<TaskListResponse> {
    return this.http.get<TaskListResponse>(this.apiUrl);
  }

  getTaskById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}/${id}`);
  }

  createTask(data: CreateTaskDto): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.apiUrl, data);
  }

  updateTask(id: number, data: Partial<CreateTaskDto>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, data);
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
