import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { StackVisualizationService, StateResponse } from '../../services/stack-visualization.service';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css'
})
export class StackComponent {
  inputValue: number = 0;
  initialInput = '4, 9, 1, 7';
  state: number[] = [];
  serverMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private readonly stackService: StackVisualizationService) {}

  initialize(): void {
    const parsed = this.parseInput(this.initialInput);
    if (!parsed.ok) {
      this.errorMessage = parsed.error;
      return;
    }
    this.loading = true;
    this.stackService.create(parsed.values).subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  push(): void {
    this.loading = true;
    this.stackService.push(this.inputValue).subscribe({
      next: (response) => this.applyState(response),
      error: (err) => this.handleError(err),
      complete: () => (this.loading = false)
    });
  }

  pop(): void {
    this.loading = true;
    this.stackService.pop().subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  peek(): void {
    this.loading = true;
    this.stackService.peek().subscribe({
      next: (response) => this.applyState(response),
      error: (err) => this.handleError(err),
      complete: () => (this.loading = false)
    });
  }

  private applyState(response: StateResponse): void {
    this.serverMessage = response.message;
    this.errorMessage = '';
    this.state = response.values ?? [];
  }

  private handleError(error: HttpErrorResponse): void {
    this.loading = false;
    this.serverMessage = '';
    this.errorMessage = error.error?.message ?? 'Operation failed.';
  }

  private parseInput(value: string): { ok: true; values: number[] } | { ok: false; error: string } {
    const tokens = value
      .split(',')
      .map((token) => token.trim())
      .filter((token) => token.length > 0);

    if (tokens.length === 0) {
      return { ok: false, error: 'Enter at least one number.' };
    }

    const parsed = tokens.map((token) => Number(token));
    if (parsed.some((item) => Number.isNaN(item))) {
      return { ok: false, error: 'Input must be comma-separated numbers only.' };
    }
    return { ok: true, values: parsed };
  }
}
