import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', [
      'addTask',
      'updateTask',
      'getPrioritySuggestion',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.taskForm.invalid).toBeTruthy();
  });

  it('should require title and priority', () => {
    const titleControl = component.taskForm.get('title');
    const priorityControl = component.taskForm.get('priority');
    expect(titleControl?.hasError('required')).toBeTruthy();
    expect(priorityControl?.hasError('required')).toBeTruthy();
  });

  it('should enable submit when title and priority are filled', () => {
    component.taskForm.patchValue({
      title: 'New Task',
      priority: 'high',
    });
    expect(component.taskForm.valid).toBeTruthy();
  });

  it('should reset form after submission', () => {
    component.taskForm.patchValue({
      title: 'Test Task',
      priority: 'high',
      status: 'in-progress',
    });
    component.onSubmit();
    expect(component.taskForm.get('title')?.value).toBeNull();
    expect(component.taskForm.pristine).toBeTruthy();
  });

  it('should set form to edit mode when editingTask is provided', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Edit Task',
      priority: 'low',
      description: 'Test',
      dueDate: new Date(),
      status: 'to-do',
      history: [],
    };
    component.editingTask = mockTask;
    component.ngOnChanges({
      editingTask: {
        currentValue: component.editingTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.taskForm.get('title')?.value).toBe('Edit Task');
    expect(component.taskForm.get('priority')?.value).toBe('low');
  });

  it('should call getPrioritySuggestion on suggestPriority', () => {
    mockTaskService.getPrioritySuggestion.and.returnValue(
      Promise.resolve('high')
    );
    component.taskForm.patchValue({
      title: 'Test',
      description: 'Test description',
    });
    component.suggestPriority();
    expect(mockTaskService.getPrioritySuggestion).toHaveBeenCalled();
  });
});
