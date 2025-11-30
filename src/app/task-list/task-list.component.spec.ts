import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let tasksSubject: BehaviorSubject<Task[]>;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'High Priority Task',
      priority: 'high',
      description: 'Test',
      dueDate: new Date(),
      status: 'to-do',
      history: [],
    },
    {
      id: 2,
      title: 'Medium Priority Task',
      priority: 'medium',
      description: 'Test',
      dueDate: new Date(),
      status: 'in-progress',
      history: [],
    },
    {
      id: 3,
      title: 'Low Priority Task',
      priority: 'low',
      description: 'Test',
      dueDate: new Date(),
      status: 'completed',
      history: [],
    },
  ];

  beforeEach(async () => {
    tasksSubject = new BehaviorSubject<Task[]>(mockTasks);
    mockTaskService = jasmine.createSpyObj('TaskService', ['deleteTask']);
    mockTaskService.tasks$ = tasksSubject.asObservable();
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks from service on init', () => {
    expect(component.tasks.length).toBe(3);
  });

  it('should sort tasks by priority', () => {
    expect(component.tasks[0].priority).toBe('high');
    expect(component.tasks[1].priority).toBe('medium');
    expect(component.tasks[2].priority).toBe('low');
  });

  it('should emit editTask when onEditTask is called', () => {
    spyOn(component.editTask, 'emit');
    const task = mockTasks[0];
    component.onEditTask(task);
    expect(component.editTask.emit).toHaveBeenCalledWith(task);
  });

  it('should call deleteTask on service when onDeleteTask is called', () => {
    component.onDeleteTask(1);
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should open dialog when onViewTask is called', () => {
    const task = mockTasks[0];
    component.onViewTask(task);
    expect(mockDialog.open).toHaveBeenCalled();
  });
});
