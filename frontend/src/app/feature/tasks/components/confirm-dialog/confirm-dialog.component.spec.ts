import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Task } from '@feature/tasks/model/tasks.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

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
      imports: [
        ConfirmDialogComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      providers: [
        { provide: DynamicDialogRef, useValue: refMock },
        { provide: DynamicDialogConfig, useValue: configMock },
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

  it('should have task from config data', () => {
    expect(component.task).toEqual(mockTask);
  });

  it('should close dialog when confirm is called', () => {
    component.confirm();
    expect(refMock.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog when cancel is called', () => {
    component.cancel();
    expect(refMock.close).toHaveBeenCalledWith(false);
  });
});