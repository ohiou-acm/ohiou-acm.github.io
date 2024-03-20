import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from './login-form/login-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  user: User | null = null;

  subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUser().subscribe((user) => (this.user = user))
    );
  }

  openUserDialog() {
    const dialogRef = this.dialog.open(LoginFormComponent);
    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.mode === 'create') {
            this.userService.signIn(result.email, result.password, true);
          } else if (result.mode === 'signIn') {
            this.userService.signIn(result.email, result.password);
          } else {
            this.userService.signOut();
          }
        }
      })
    );
  }
}
