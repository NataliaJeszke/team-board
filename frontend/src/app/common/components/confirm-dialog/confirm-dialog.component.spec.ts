import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Task } from '@feature/tasks/model/tasks.model';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    createdById: 0,
    priority: 'medium',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedToId: 2,
  };

  const refMock = { close: jest.fn() };
  const configMock = { data: { task: mockTask } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, TranslateModule.forRoot()], // standalone w imports
      providers: [
        { provide: DynamicDialogRef, useValue: refMock },
        { provide: DynamicDialogConfig, useValue: configMock },
        { 
          provide: TranslateService, 
          useValue: {
            instant: (key: string) => key, // synchronously zwraca klucz
            get: (key: string) => of(key),  // asynchronicznie zwraca Observable
          } 
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});