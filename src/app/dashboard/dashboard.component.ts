import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  total = 0;
  completed = 0;
  inProgress = 0;

  constructor(private ts: TaskService) {}

  ngOnInit(): void {
    this.ts.getTasks().subscribe((tasks) => {
      this.total = tasks.length;
      this.completed = tasks.filter((t) => t.status === 'completed').length;
      this.inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    });
  }
}
