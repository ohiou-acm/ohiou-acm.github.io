import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialFormsModule } from '../material-forms.module';

@Component({
  selector: 'app-event-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MaterialFormsModule,
    MatButtonModule,
  ],
  templateUrl: './event-form-dialog.component.html',
  styleUrl: './event-form-dialog.component.scss',
})
export class EventFormDialogComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormDialogComponent>
  ) {}

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    upvotes: [0],
    date: [],
    presenter: [],
  });

  updateEvent(): void {
    if (this.eventForm.invalid) {
      return;
    }
    this.dialogRef.close(this.eventForm.value);
  }
}
