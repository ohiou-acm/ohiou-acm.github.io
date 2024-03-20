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
    @Inject(MAT_DIALOG_DATA) public member: Member
  ) {}

  // Default values to passed in data or empty
  memberForm = this.fb.group({
    name: [this.member ? this.member.name : '', Validators.required],
    email: [this.member ? this.member.email : '', Validators.required],
    officer: [this.member ? this.member.officer : ''],
    graduationDate: [
      this.member ? this.member.graduationDate : new Date(),
      Validators.required,
    ],
    employment: [this.member ? this.member.employment : ''],
    selfBio: [this.member ? this.member.selfBio : ''],
    photoURL: [this.member ? this.member.photoURL : ''],
    id: [this.member ? this.member.id : ''],
  });

  updateMember(): void {
    if (this.memberForm.invalid) {
      return;
    }
    this.dialogRef.close(this.memberForm.value);
  }
}
