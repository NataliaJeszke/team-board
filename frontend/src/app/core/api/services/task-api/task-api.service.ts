import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '@core/api/config/constants/api-endpoints.constants';
import { TaskListResponse, TaskResponse, NewTaskRequest } from '@core/api/models/task/task-api.model';
import { Task, TaskStatus } from '@feature/tasks/model/tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private http = inject(HttpClient);

  getTasks(): Observable<TaskListResponse> {
    return this.http.get<TaskListResponse>(API_ENDPOINTS.TASKS.BASE);
  }

  getTaskById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  createTask(data: NewTaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(API_ENDPOINTS.TASKS.BASE, data);
  }

  updateTask(id: number, data: Partial<Task>): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(API_ENDPOINTS.TASKS.BY_ID(id), data);
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(
      API_ENDPOINTS.TASKS.STATUS(id), 
      { status }
    );
  }

  deleteTask(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.TASKS.BY_ID(id)
    );
  }
}