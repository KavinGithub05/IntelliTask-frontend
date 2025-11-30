import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      priority: 'high',
      description: '',
      dueDate: new Date(),
      status: 'completed',
      history: [],
    },
    {
      id: 2,
      title: 'Task 2',
      priority: 'medium',
      description: '',
      dueDate: new Date(),
      status: 'in-progress',
      history: [],
    },
    {
      id: 3,
      title: 'Task 3',
      priority: 'low',
      description: '',
      dueDate: new Date(),
      status: 'in-progress',
      history: [],
    },
    {
      id: 4,
      title: 'Task 4',
      priority: 'high',
      description: '',
      dueDate: new Date(),
      status: 'to-do',
      history: [],
    },
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    mockTaskService.getTasks.and.returnValue(of(mockTasks));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total tasks correctly', () => {
    expect(component.total).toBe(4);
  });

  it('should calculate completed tasks correctly', () => {
    expect(component.completed).toBe(1);
  });

  it('should calculate in-progress tasks correctly', () => {
    expect(component.inProgress).toBe(2);
  });

  it('should display KPI values in template', () => {
    const compiled = fixture.nativeElement;
    const kpiElements = compiled.querySelectorAll('.kpi');
    expect(kpiElements[0].textContent).toContain('4');
    expect(kpiElements[1].textContent).toContain('1');
    expect(kpiElements[2].textContent).toContain('2');
  });
});
