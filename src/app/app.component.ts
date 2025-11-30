import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';
import { Task } from './models/task.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'IntelliTask';
  selectedTask?: Task;
  sidebarOpen = false;
  isAuthenticated = false;
  showSidebar = false; // Control sidebar visibility

  constructor(
    private taskService: TaskService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    // Listen to route changes to control sidebar visibility
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Hide sidebar on login and register routes
        this.showSidebar =
          !event.urlAfterRedirects.includes('login') &&
          !event.urlAfterRedirects.includes('register');
      });
  }

  onEditTask(task: Task): void {
    this.selectedTask = task;
  }

  onTaskUpdated(): void {
    this.selectedTask = undefined;
  }

  exportTasks(): void {
    this.taskService.exportTasksToCSV();
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.showSidebar = false; // Hide sidebar after logout
        this.router.navigate(['/login']);
      },
      error: () => {
        this.showSidebar = false;
        this.router.navigate(['/login']);
      },
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
