import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private tasks: Task[] = [];
  private baseUrl: string;
  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiUrl;
    this.baseUrl = `${this.apiBaseUrl}/tasks`;
    this.fetchTasks();
  }


  private loadTasksFromLocal(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  private saveTasksToLocal(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private fetchTasks(): void {
    this.http
      .get<any[]>(this.baseUrl)
      .pipe(
        catchError((err) => {
          console.warn(
            'Failed to fetch tasks from backend. Falling back to localStorage.',
            err.message
          );
          return of(this.loadTasksFromLocal());
        }),
        tap((tasks: any[]) => {
          // Map backend response (_id) to frontend model (id)
          this.tasks = tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            history: task.history
          }));
          this.tasksSubject.next(this.tasks);
          this.saveTasksToLocal();
        })
      )
      .subscribe();
  }

  addTask(task: Task): void {
    this.http
      .post<any>(this.baseUrl, task)
      .pipe(
        tap((newTask: any) => {
          // Map backend response (_id) to frontend model (id)
          const mappedTask: Task = {
            id: newTask._id,
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            priority: newTask.priority,
            status: newTask.status,
            history: newTask.history
          };
          this.tasks.push(mappedTask);
          this.tasksSubject.next(this.tasks);
          this.saveTasksToLocal();
        }),
        catchError((err) => {
          console.warn(
            'Failed to add task to backend. Saving to local only.',
            err.message
          );
          // local fallback - generate temporary id
          const localTask = { ...task, id: Date.now().toString() };
          this.tasks.push(localTask);
          this.tasksSubject.next(this.tasks);
          this.saveTasksToLocal();
          return of(null);
        })
      )
      .subscribe();
  }

  updateTask(updatedTask: Task): void {
    this.http
      .put<Task>(`${this.baseUrl}/${updatedTask.id}`, updatedTask)
      .pipe(
        tap((task) => {
          const index = this.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            this.tasks[index] = task;
            this.tasksSubject.next(this.tasks);
            this.saveTasksToLocal();
          }
        }),
        catchError((err) => {
          // local fallback
          const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.tasksSubject.next(this.tasks);
            this.saveTasksToLocal();
          }
          return of(null);
        })
      )
      .subscribe();
  }

  deleteTask(taskId: string): void {
    this.http
      .delete(`${this.baseUrl}/${taskId}`)
      .pipe(
        tap(() => {
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          this.tasksSubject.next(this.tasks);
          this.saveTasksToLocal();
        }),
        catchError((err) => {
          console.warn(
            'Failed to delete task from backend. Deleting locally only.',
            err.message
          );
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          this.tasksSubject.next(this.tasks);
          this.saveTasksToLocal();
          return of(null);
        })
      )
      .subscribe();
  }

  // Backwards-compatible method for legacy components
  handleDelete(task: Task): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${task.id}`).pipe(
      tap(() => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.tasksSubject.next(this.tasks);
        this.saveTasksToLocal();
      }),
      catchError((err) => {
        console.warn(
          'Failed to delete task from backend. Deleting locally only.',
          err.message
        );
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.tasksSubject.next(this.tasks);
        this.saveTasksToLocal();
        return of(null);
      })
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  exportTasksToCSV(): void {
    const tasks = this.tasks;
    const csvData = tasks.map((task) => ({
      Title: task.title,
      Description: task.description,
      'Due Date': task.dueDate,
      Priority: task.priority,
      Status: task.status,
      History: task.history.join(' | '),
    }));

    const csvContent = [
      ['Title', 'Description', 'Due Date', 'Priority', 'Status', 'History'],
      ...csvData.map((task) => [
        task.Title,
        task.Description,
        task['Due Date'],
        task.Priority,
        task.Status,
        task.History,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tasks.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // AI priority suggestion (calls backend endpoint)
  getPrioritySuggestion(payload: { title?: string; description?: string }) {
    return this.http.post<{ priority: string }>(
      `${this.apiBaseUrl}/ai/priority-suggestion`,
      payload
    );
  }
}
