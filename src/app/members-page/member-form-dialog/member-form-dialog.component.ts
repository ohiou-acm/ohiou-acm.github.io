import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Member } from '../../app.types';
import { MaterialFormsModule } from '../../material-forms.module';

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MaterialFormsModule,
    MatButtonModule,
  ],
  templateUrl: './member-form-dialog.component.html',
  styleUrl: './member-form-dialog.component.scss',
})
export class MemberFormDialogComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MemberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: Member; email: string }
  ) {}

  // Default values to passed in data or empty
  memberForm = this.fb.group({
    name: [this.data.member ? this.data.member.name : '', Validators.required],
    email: [this.data.email, Validators.required],
    officer: [this.data.member ? this.data.member.officer : ''],
    graduationDate: [
      this.data.member ? this.data.member.graduationDate : new Date(),
      Validators.required,
    ],
    employment: [this.data.member ? this.data.member.employment : ''],
    selfBio: [this.data.member ? this.data.member.selfBio : ''],
    photoURL: [this.data.member ? this.data.member.photoURL : undefined],
    id: [this.data.member ? this.data.member.id : ''],
  });

  updateMember(): void {
    if (this.memberForm.invalid) {
      return;
    }
    this.dialogRef.close(this.memberForm.value);
  }
}
