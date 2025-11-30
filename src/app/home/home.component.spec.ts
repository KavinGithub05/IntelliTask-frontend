import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { Task } from '../models/task.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no selected task', () => {
    expect(component.selectedTask).toBeUndefined();
  });

  it('should set selectedTask when onEditTask is called', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      priority: 'high',
      description: 'Test',
      dueDate: new Date(),
      status: 'to-do',
      history: [],
    };
    component.onEditTask(mockTask);
    expect(component.selectedTask).toBe(mockTask);
  });

  it('should clear selectedTask when onTaskUpdated is called', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      priority: 'high',
      description: 'Test',
      dueDate: new Date(),
      status: 'to-do',
      history: [],
    };
    component.selectedTask = mockTask;
    component.onTaskUpdated();
    expect(component.selectedTask).toBeUndefined();
  });

  it('should display task-form and task-list sections', () => {
    const compiled = fixture.nativeElement;
    const sections = compiled.querySelectorAll('section');
    expect(sections.length).toBe(2);
    expect(sections[0].classList.contains('task-form-section')).toBeTruthy();
    expect(sections[1].classList.contains('task-list-section')).toBeTruthy();
  });
});
