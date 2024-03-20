import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MemberCardComponent } from './member-card/member-card.component';
import { Member } from '../app.types';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MemberFormDialogComponent } from './member-form-dialog/member-form-dialog.component';
import {
  Firestore,
  collection,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Subscription, from, mergeMap, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [MatExpansionModule, MemberCardComponent, MatButtonModule],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
})
export class MembersPageComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private store: Firestore,
    private userService: UserService
  ) {}

  membersList: Member[] = [];

  currentOfficers: Member[] = [];
  currentOfficersExpanded = true;

  currentMembers: Member[] = [];
  currentMembersExpanded = true;

  alumni: Member[] = [];
  alumniExpanded = true;

  subscription: Subscription = new Subscription();

  user: User | null = null;

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUser().subscribe((user) => {
        this.user = user;
      })
    );
  }

  // Create a callback to reload data when Firestore has an update
  // This is done in this way to enable reload as the onSnapshot function is not a promise to be converted into an observable
  unsubscribeSnapshot = onSnapshot(
    collection(this.store, 'members'),
    (querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
      this.membersList = [];
      querySnapshot.forEach((doc) =>
        this.membersList.push(this.createMember(doc.id, doc.data()))
      );
      this.groupMembers();
    }
  );

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }

  createMember(docID: string, docData: DocumentData): Member {
    const newMember: Member = {
      id: docID,
      name: docData['name'],
      email: docData['email'],
      graduationDate: new Date(docData['graduationDate'].seconds * 1000),
      officer: docData['officer'],
      employment: docData['employment'],
      selfBio: docData['selfBio'],
      photoURL: docData['photoURL'],
    };

    return newMember;
  }

  //group members into current officers, current members, and alumni
  groupMembers() {
    // sort members by graduation date, seniors at the top
    this.membersList.sort((a, b) => {
      return a.graduationDate.getTime() - b.graduationDate.getTime();
    });

    this.currentOfficers = [];
    this.currentMembers = [];
    this.alumni = [];

    this.membersList.forEach((member) => {
      if (member.graduationDate > new Date()) {
        if (member.officer) {
          this.currentOfficers.push(member);
        } else {
          this.currentMembers.push(member);
        }
      } else {
        this.alumni.push(member);
      }
    });
  }

  // if user signed in then allow them to create themselves as a member
  updateMember(member?: Member) {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      data: { member: member, email: this.user!.email },
    });

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          mergeMap((result) => {
            if (result) {
              if (result['id']) {
                // update existing member
                return from(
                  setDoc(doc(this.store, 'members', result['id']), result)
                );
              } else {
                // add new member
                return from(addDoc(collection(this.store, 'members'), result));
              }
            }
            return of(null);
          })
        )
        .subscribe(() => this.groupMembers())
    );
  }
}
