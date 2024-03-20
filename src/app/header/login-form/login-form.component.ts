import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MaterialFormsModule } from '../../material-forms.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MaterialFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    private userService: UserService
  ) {}

  user = this.userService.getUser();

  hidePass = true;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(mode: string): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.dialogRef.close({ mode: mode, ...this.loginForm.value });
  }

  signOut(): void {
    this.dialogRef.close({ mode: 'signOut' });
  }
}
