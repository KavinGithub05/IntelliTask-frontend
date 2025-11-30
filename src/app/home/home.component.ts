import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { RouterModule } from '@angular/router';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selectedTask: Task | undefined;

  onEditTask(task: Task): void {
    this.selectedTask = task;
  }

  onTaskUpdated(): void {
    this.selectedTask = undefined;
  }
}
