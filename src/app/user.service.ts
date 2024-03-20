import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  from,
  of,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );

  subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUser(): Observable<User | null> {
    return this.user.asObservable();
  }

  signIn(email: string, password: string, createAcct: boolean = false): void {
    const observable = createAcct
      ? from(createUserWithEmailAndPassword(this.auth, email, password))
      : from(signInWithEmailAndPassword(this.auth, email, password));

    this.subscription.add(
      observable
        .pipe(
          tap((userCredential) => this.user.next(userCredential.user)),
          catchError((error: { code: string; message: string }) => {
            console.error(error.code + ': ' + error.message);
            this.toast.error(error.code + ': ' + error.message);
            return of();
          })
        )
        .subscribe()
    );
  }

  signOut() {
    this.subscription.add(
      from(signOut(this.auth)).subscribe(() => this.user.next(null))
    );
  }
}
