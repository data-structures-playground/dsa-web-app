import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ArrayStateResponse, ArrayVisualizationService } from '../../services/array-visualization.service';

@Component({
  selector: 'app-array-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './array-crud.component.html',
  styleUrl: './array-crud.component.css'
})
export class ArrayCrudComponent {
  arrayInput = '4, 9, 1, 7';
  updateIndex = 0;
  updateValue = 0;
  addValue = 0;
  deleteIndex = 0;

  state: number[] = [];
  serverMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private readonly arrayService: ArrayVisualizationService) {}

  createArray(): void {
    const parsed = this.parseInput(this.arrayInput);
    if (!parsed.ok) {
      this.errorMessage = parsed.error;
      return;
    }
    this.loading = true;
    this.arrayService.create(parsed.values).subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  readArray(): void {
    this.loading = true;
    this.arrayService.read().subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  updateArrayValue(): void {
    this.loading = true;
    this.arrayService.update(this.updateIndex, this.updateValue).subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  deleteArrayValue(): void {
    this.loading = true;
    this.arrayService.delete(this.deleteIndex).subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  addArrayValue(): void {
    this.loading = true;
    this.arrayService.add(this.addValue).subscribe({
      next: (response) => this.applyState(response),
      error: (error) => this.handleError(error),
      complete: () => (this.loading = false)
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  private applyState(response: ArrayStateResponse): void {
    this.serverMessage = response.message;
    this.errorMessage = '';
    this.state = response.values ?? [];
  }

  private handleError(error: HttpErrorResponse): void {
    this.loading = false;
    this.serverMessage = '';
    const message = error.error?.message ?? 'Operation failed.';
    this.errorMessage = message;
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
      return { ok: false, error: 'Array input must be comma-separated numbers only.' };
    }
    return { ok: true, values: parsed };
  }
}
