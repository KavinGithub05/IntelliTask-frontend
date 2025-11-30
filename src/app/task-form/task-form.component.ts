import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit?: Task;
  taskForm: FormGroup;

  // AI Suggestion state
  aiSuggestion: string | null = null;
  aiLoading = false;
  suggestDebounce = new Subject<void>();

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['', Validators.required],
      status: ['to-do'],
    });

    // Debounce AI suggestion requests (wait 1s after user stops typing)
    this.suggestDebounce.pipe(debounceTime(1000)).subscribe(() => {
      this.getAISuggestion();
    });
  }

  triggerAISuggestion(): void {
    this.suggestDebounce.next();
  }

  private getAISuggestion(): void {
    const title = this.taskForm.get('title')?.value || '';
    const description = this.taskForm.get('description')?.value || '';

    if (!title && !description) {
      this.aiSuggestion = null;
      return;
    }

    this.aiLoading = true;
    this.taskService.getPrioritySuggestion({ title, description }).subscribe({
      next: (res: any) => {
        if (res?.priority) {
          this.aiSuggestion = res.priority;
        }
        this.aiLoading = false;
      },
      error: (err) => {
        console.warn('AI suggestion failed', err);
        this.aiLoading = false;
      },
    });
  }

  applyAISuggestion(): void {
    if (this.aiSuggestion) {
      this.taskForm.patchValue({ priority: this.aiSuggestion });
      this.aiSuggestion = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue(this.taskToEdit);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      alert('Please fill in the required fields: Title and Priority.');
      return;
    }
    const formValue = this.taskForm.value;
    const now = new Date().toLocaleString();
    if (this.taskToEdit) {
      const updatedTask: Task = {
        ...this.taskToEdit,
        ...formValue,
        history: [
          ...this.taskToEdit.history,
          `Task "${
            this.taskToEdit.title
          }" updated on ${now}: ${this.generateUpdateLog(
            this.taskToEdit,
            formValue
          )}`,
        ],
      };
      this.taskService.updateTask(updatedTask);
      this.taskToEdit = undefined;
    } else {
      const newTask: Task = {
        ...formValue,
        id: Date.now(),
        history: [`Task "${formValue.title}" created on ${now}`],
      };
      this.taskService.addTask(newTask);
    }
    this.taskForm.reset({ status: 'to-do', priority: '' });
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
    this.taskForm.updateValueAndValidity();
    this.aiSuggestion = null;
  }

  private generateUpdateLog(oldTask: Task, newTask: any): string {
    let log = '';
    if (oldTask.title !== newTask.title)
      log += `Title changed from "${oldTask.title}" to "${newTask.title}". `;
    if (oldTask.description !== newTask.description)
      log += `Description changed. `;
    if (oldTask.dueDate !== newTask.dueDate)
      log += `Due date changed from ${oldTask.dueDate} to ${newTask.dueDate}. `;
    if (oldTask.priority !== newTask.priority)
      log += `Priority changed from ${oldTask.priority} to ${newTask.priority}. `;
    if (oldTask.status !== newTask.status)
      log += `Status changed from ${oldTask.status} to ${newTask.status}. `;
    return log.trim();
  }
}
