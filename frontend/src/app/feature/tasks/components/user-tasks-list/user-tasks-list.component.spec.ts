import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockBuilder } from 'ng-mocks';

import { UserTasksComponent } from './user-tasks-list.component';
import { User } from '@core/models';
import { Task } from '@feature/tasks/model/tasks.model';

describe('UserTasksComponent', () => {
  let component: UserTasksComponent;
  let fixture: ComponentFixture<UserTasksComponent>;

  const mockUser: User = {
    id: 1,
    name: 'testuser',
    email: 'test@example.com',
  };

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      status: 'todo',
      priority: 'medium',
      assignedToId: 1,
      createdById: 1,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 2,
      title: 'Task 2',
      status: 'in_progress',
      priority: 'high',
      assignedToId: 1,
      createdById: 2,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02'),
    },
  ];

  beforeEach(async () => {
    await MockBuilder(UserTasksComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTasksComponent);
    component = fixture.componentInstance;

    // Ustawiamy inputy przed detectChanges
    fixture.componentRef.setInput('user_', mockUser);
    fixture.componentRef.setInput('tasks_', mockTasks);
    fixture.componentRef.setInput('loading_', false);

    fixture.detectChanges(); // teraz inputy są już dostępne
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept user_ input', () => {
      expect(component.user_()).toEqual(mockUser);
    });

    it('should accept tasks_ input', () => {
      expect(component.tasks_()).toEqual(mockTasks);
    });

    it('should accept loading_ input', () => {
      fixture.componentRef.setInput('loading_', true);
      fixture.detectChanges();
      expect(component.loading_()).toBe(true);
    });

    it('should have default tasks_ value as empty array', () => {
      const newFixture = TestBed.createComponent(UserTasksComponent);
      const newComponent = newFixture.componentInstance;

      // ustawiamy tylko wymagany input user
      newFixture.componentRef.setInput('user_', mockUser);
      newFixture.detectChanges();

      expect(newComponent.tasks_()).toEqual([]); // domyślnie pusta tablica
    });

    it('should have default loading_ value as false', () => {
      const newFixture = TestBed.createComponent(UserTasksComponent);
      const newComponent = newFixture.componentInstance;

      newFixture.componentRef.setInput('user_', mockUser);
      newFixture.detectChanges();

      expect(newComponent.loading_()).toBe(false); // domyślnie false
    });
  });
});